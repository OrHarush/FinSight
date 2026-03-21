# Layer Separation: Service → Repository

## The Rule

**Repositories speak `IEntity` only.** They have no knowledge of DTOs or `@finsight/shared`.
**Services own all mapping.** Every DTO→model conversion (string IDs → ObjectId, string dates → Date, field renames, defaults) happens before calling the repo.

```
Controller  →  Service (maps DTO → IEntity)  →  Repository (IEntity only)
```

## Why

Keeps DB access pure and reusable. Repos stay simple — they receive already-mapped data and just execute queries. Services stay testable — mapping logic is in one place, not scattered across layers.

## Example

**Service** — receives DTO, builds `IEntity`, calls repo:
```ts
// accountService.ts
export const create = async (data: CreateAccountDTO, userId: string) => {
  const mapped: Omit<IAccount, '_id'> = {
    name: data.name,
    balance: data.balance,
    currency: data.currency ?? 'ILS',       // default applied here
    userId: new Types.ObjectId(userId),     // string → ObjectId here
    isPrimary: false,
  };

  return accountRepository.insert(mapped);  // repo gets IAccount, not DTO
};
```

**Repository** — only accepts `IAccount`, no DTO imports:
```ts
// accountRepository.ts
import Account, { IAccount } from '../models/Account'; // no @finsight/shared

export const insert = async (data: Omit<IAccount, '_id'>) => {
  return new Account(data).save();
};

export const updateById = async (id: string, data: Partial<IAccount>, userId: string) =>
  Account.findOneAndUpdate({ _id: id, userId: new Types.ObjectId(userId) }, data, { new: true })
    .lean<IAccount>()
    .exec();
```

## Key Constraints

- `insert` takes `Omit<IEntity, '_id'>` — all required fields, no ID
- `updateById` takes `Partial<IEntity>` — only fields being changed
- Never mutate input — always build a new mapped object in the service
- Shared mapping utilities (e.g. `toObjectId`, `toDate`) live in `server/src/utils/` to avoid duplication across services
