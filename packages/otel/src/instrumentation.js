// @dn-fe/otel - OpenTelemetry instrumentation entry point
// Load via: node --env-file=.env --import @dn-fe/otel/src/instrumentation.js build/index.js
//
// Required env vars:
//   OTEL_SERVICE_NAME               - service name (e.g. "url-shortener-admin")
//   OTEL_EXPORTER_OTLP_ENDPOINT     - base endpoint (e.g. "http://localhost:5080/api/default")
//   OTEL_EXPORTER_OTLP_HEADERS      - headers as "Key=Value,Key2=Value2"
//
// Optional env vars:
//   OTEL_SDK_DISABLED               - set to "true" to disable (default: enabled)

import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-http';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';
import { BatchLogRecordProcessor } from '@opentelemetry/sdk-logs';
import { SeverityNumber } from '@opentelemetry/api-logs';
import { logs } from '@opentelemetry/api-logs';

// Respect OTEL_SDK_DISABLED standard env var
if (process.env.OTEL_SDK_DISABLED === 'true') {
	console.log('[otel] SDK disabled via OTEL_SDK_DISABLED=true');
} else {
	const serviceName = process.env.OTEL_SERVICE_NAME || 'sveltekit-app';
	const endpoint = process.env.OTEL_EXPORTER_OTLP_ENDPOINT || 'http://localhost:5080/api/default';

	// Parse OTEL_EXPORTER_OTLP_HEADERS="Key=Value,Key2=Value2" into an object
	const headers = {};
	const rawHeaders = process.env.OTEL_EXPORTER_OTLP_HEADERS || '';
	if (rawHeaders) {
		for (const pair of rawHeaders.split(',')) {
			const eqIdx = pair.indexOf('=');
			if (eqIdx !== -1) {
				const key = pair.slice(0, eqIdx).trim();
				const value = pair.slice(eqIdx + 1).trim();
				headers[key] = value;
			}
		}
	}

	const sdk = new NodeSDK({
		serviceName,
		traceExporter: new OTLPTraceExporter({
			url: `${endpoint}/v1/traces`,
			headers,
		}),
		metricReader: new PeriodicExportingMetricReader({
			exporter: new OTLPMetricExporter({
				url: `${endpoint}/v1/metrics`,
				headers,
			}),
			exportIntervalMillis: 60_000,
		}),
		logRecordProcessor: new BatchLogRecordProcessor(
			new OTLPLogExporter({
				url: `${endpoint}/v1/logs`,
				headers,
			})
		),
		instrumentations: [
			getNodeAutoInstrumentations({
				// Reduce noise — disable fs instrumentation (very chatty)
				'@opentelemetry/instrumentation-fs': { enabled: false },
			}),
		],
	});

	sdk.start();

	// Bridge console.* to OpenTelemetry logs so console.log/warn/error appear in the collector
	const logger = logs.getLogger('console');

	const SEVERITY = {
		log:   { text: 'INFO',  number: SeverityNumber.INFO },
		info:  { text: 'INFO',  number: SeverityNumber.INFO },
		warn:  { text: 'WARN',  number: SeverityNumber.WARN },
		error: { text: 'ERROR', number: SeverityNumber.ERROR },
		debug: { text: 'DEBUG', number: SeverityNumber.DEBUG },
	};

	for (const [method, severity] of Object.entries(SEVERITY)) {
		const original = console[method].bind(console);
		console[method] = (...args) => {
			// Still print to stdout so local terminal output is preserved
			original(...args);
			// Emit as OTEL log record
			logger.emit({
				severityNumber: severity.number,
				severityText: severity.text,
				body: args.map((a) => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' '),
			});
		};
	}

	process.stdout.write(`[otel] Started — service: ${serviceName}, endpoint: ${endpoint}\n`);

	process.on('SIGTERM', async () => {
		await sdk.shutdown();
		process.exit(0);
	});

	process.on('SIGINT', async () => {
		await sdk.shutdown();
		process.exit(0);
	});
}
