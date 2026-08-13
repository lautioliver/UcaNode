---
name: git-workflow
description: Flujo de ramas y PRs de UcaNode. Usar siempre que crees ramas, commits, pushes o pull requests en este repo.
---

# Git workflow — UcaNode

## Ramas

| Rama | Rol |
|---|---|
| `develop` | Integración: **base por defecto** para PRs de features y fixes |
| `main` | Producción: solo recibe PRs desde `develop` (releases) |

## Reglas obligatorias para agentes

1. **Nunca** abras un PR de feature/fix contra `main`. La base **siempre** es `develop`.
2. Creá ramas de trabajo desde `develop` actualizado (`git fetch origin develop && git checkout develop && git pull origin develop`).
3. Al crear PRs con `ManagePullRequest`, pasá `base_branch: develop` explícitamente. **No uses `main` como base** salvo que el usuario pida explícitamente un release `develop → main`.
4. Workflows de CI (`.github/workflows/`) deben dispararse en `develop`, no en `main`, salvo que el workflow sea específico de producción.
5. Badges dinámicos de GitHub Actions en README deben apuntar a `branch=develop`.

## Flujo típico

```text
feature/fix-branch  →  PR a develop  →  merge
develop             →  PR a main       →  merge (release, manual o explícito)
```

## Ejemplo de PR correcto

```yaml
action: create_pr
base_branch: develop
branch_name: cursor/mi-cambio-3482
```

## Ejemplo de PR incorrecto (prohibido para features)

```yaml
base_branch: main   # ❌ solo para releases develop → main
```
