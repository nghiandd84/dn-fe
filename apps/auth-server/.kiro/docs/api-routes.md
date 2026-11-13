# API Routes

## Public Routes (no auth required)

### Auth
| Method | Path | Backend | Description |
|--------|------|---------|-------------|
| POST | `/api/auth/login` | `/public/requests/login` | Login, sets session cookie |
| POST | `/api/auth/register` | `/public/requests/register` | Register, sets session cookie |
| POST | `/api/auth/logout` | — | Clears session cookie |

### OAuth
| Method | Path | Backend | Description |
|--------|------|---------|-------------|
| POST | `/api/oauth/authorize` | `/public/requests/code` | Request authorization code |
| POST | `/api/oauth/token` | `/public/tokens/oauth` | Exchange code for token |
| POST | `/api/oauth/verify` | `/public/tokens/verify` | Verify token |

## Protected Routes (require valid token in cookie)

### Clients
| Method | Path | Backend | Description |
|--------|------|---------|-------------|
| GET | `/api/admin/clients` | `/clients` | List/filter clients |
| POST | `/api/admin/clients` | `/clients` | Create client |
| GET | `/api/admin/clients/[id]` | `/clients/{id}` | Get client |
| PATCH | `/api/admin/clients/[id]` | `/clients/{id}` | Update client |
| DELETE | `/api/admin/clients/[id]` | `/clients/{id}` | Delete client |

### Roles
| Method | Path | Backend | Description |
|--------|------|---------|-------------|
| GET | `/api/admin/roles` | `/roles` | List/filter roles |
| POST | `/api/admin/roles` | `/roles` | Create role |
| GET | `/api/admin/roles/[id]` | `/roles/{id}` | Get role |
| PATCH | `/api/admin/roles/[id]` | `/roles/{id}` | Update role |
| DELETE | `/api/admin/roles/[id]` | `/roles/{id}` | Delete role |
| GET | `/api/admin/roles/[id]/permissions` | `/roles/{id}/permissions` | Get role permissions |
| POST | `/api/admin/roles/[id]/assign-permissions` | `/roles/{id}/assign-permissions` | Assign permissions |
| POST | `/api/admin/roles/[id]/unassign-permissions` | `/roles/{id}/unassign-permissions` | Unassign permissions |

### Permissions
| Method | Path | Backend | Description |
|--------|------|---------|-------------|
| GET | `/api/admin/permissions` | `/permissions` | List/filter |
| POST | `/api/admin/permissions` | `/permissions` | Create |
| GET | `/api/admin/permissions/[id]` | `/permissions/{id}` | Get |
| PATCH | `/api/admin/permissions/[id]` | `/permissions/{id}` | Update |
| DELETE | `/api/admin/permissions/[id]` | `/permissions/{id}` | Delete |

### Scopes
| Method | Path | Backend | Description |
|--------|------|---------|-------------|
| GET | `/api/admin/scopes` | `/scopes` | List/filter |
| POST | `/api/admin/scopes` | `/scopes` | Create |
| GET | `/api/admin/scopes/[id]` | `/scopes/{id}` | Get |
| PATCH | `/api/admin/scopes/[id]` | `/scopes/{id}` | Update |
| DELETE | `/api/admin/scopes/[id]` | `/scopes/{id}` | Delete |

### Users
| Method | Path | Backend | Description |
|--------|------|---------|-------------|
| GET | `/api/admin/users` | `/users` | List/filter |
| GET | `/api/admin/users/[id]` | `/users/{id}` | Get |
| DELETE | `/api/admin/users/[id]` | `/users/{id}` | Delete |

### Auth Codes
| Method | Path | Backend | Description |
|--------|------|---------|-------------|
| GET | `/api/admin/auth-codes` | `/auth-codes` | List/filter |
| POST | `/api/admin/auth-codes` | `/auth-codes` | Create |
| GET | `/api/admin/auth-codes/[id]` | `/auth-codes/{id}` | Get |
| DELETE | `/api/admin/auth-codes/[id]` | `/auth-codes/{id}` | Delete |

### Tokens
| Method | Path | Backend | Description |
|--------|------|---------|-------------|
| GET | `/api/admin/tokens` | `/tokens` | List/filter |
| GET | `/api/admin/tokens/[id]` | `/tokens/{id}` | Get |

## Query Parameters (all list endpoints)

| Param | Description | Example |
|-------|-------------|---------|
| `page` | Page number | `?page=1` |
| `page_size` | Items per page | `?page_size=10` |
| `order_name` | Sort field | `?order_name=name` |
| `order_direction` | Sort direction | `?order_direction=asc` |
| `_condition` | Filter logic: `and` (default) or `or` | `?_condition=or` |
| `{field}` | Filter: `operator\|value` | `?name=eq\|admin` |

## Filter Operators

| Operator | Code | Example |
|----------|------|---------|
| Equal | `eq` | `?name=eq\|admin` |
| Not Equal | `ne` | `?status=ne\|inactive` |
| Like | `li` | `?name=li\|adm` |
| Less Than | `lt` | `?age=lt\|30` |
| Less or Equal | `lte` | `?age=lte\|30` |
| Greater Than | `gt` | `?age=gt\|18` |
| Greater or Equal | `gte` | `?age=gte\|18` |
| In | `in` | `?status=in\|active,pending` |
| Not In | `nin` | `?status=nin\|deleted` |
| Starts With | `sw` | `?name=sw\|adm` |
