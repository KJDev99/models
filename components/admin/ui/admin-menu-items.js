import {
    SquarePen,
    PauseCircle,
    PlayCircle,
    Lock,
    LockOpen,
    Trash2,
    Settings,
    CheckSquare,
} from 'lucide-react'

// ─────────────────────────────────────────────────────────────────────────────
// «⋮» menyusi bandlari. Figma'da uch xil ko'rinish chizilgan:
//   334:14381 — faol yozuv: Редактировать · Скрыть профиль · Заблокировать · Удалить
//   345:18863 — bloklangan: ...Разблокировать...
//   334:14744 — profil sahifasida: Настройки профиля · Заблокировать · Удалить
// Ikonkalar: edit-02 → SquarePen · pause-circle → PauseCircle ·
// lock-01 → Lock · lock-unlocked-01 → LockOpen · trash-01 → Trash2.
// ─────────────────────────────────────────────────────────────────────────────

// Ro'yxatdagi qator uchun (4 band).
export function rowMenu({ status, onEdit, onToggle, onBlock, onUnblock, onDelete }) {
    const blocked = status === 'blocked'
    const paused = status === 'paused'

    return [
        { key: 'edit', label: 'Редактировать', icon: SquarePen, onClick: onEdit },
        {
            key: 'toggle',
            label: paused ? 'Показать профиль' : 'Скрыть профиль',
            icon: paused ? PlayCircle : PauseCircle,
            onClick: onToggle,
        },
        blocked
            ? { key: 'unblock', label: 'Разблокировать', icon: LockOpen, onClick: onUnblock }
            : { key: 'block', label: 'Заблокировать', icon: Lock, onClick: onBlock },
        { key: 'delete', label: 'Удалить', icon: Trash2, onClick: onDelete, danger: true },
    ]
}

// E'lonlar uchun (loyiha / maydon). Figma: «Если проект есть» 342:11512 —
// Поставить на паузу · Завершить проект · Удалить; «Если проекта нет»
// 342:11525 — Возобновить …; «проект завершен» 342:11545 — ikki band.
export function publicationMenu({ status, onPause, onResume, onFinish, onEdit, onDelete }) {
    const finished = status === 'done' || status === 'rejected' || status === 'archive'

    if (finished) {
        return [
            { key: 'edit', label: 'Редактировать', icon: SquarePen, onClick: onEdit },
            { key: 'delete', label: 'Удалить', icon: Trash2, onClick: onDelete, danger: true },
        ]
    }

    const paused = status === 'paused' || status === 'draft'

    return [
        paused
            ? { key: 'resume', label: 'Возобновить', icon: PlayCircle, onClick: onResume }
            : { key: 'pause', label: 'Поставить на паузу', icon: PauseCircle, onClick: onPause },
        { key: 'finish', label: 'Завершить проект', icon: CheckSquare, onClick: onFinish },
        { key: 'delete', label: 'Удалить', icon: Trash2, onClick: onDelete, danger: true },
    ]
}

// Profil sahifasi uchun (3 band).
export function profileMenu({ status, onSettings, onBlock, onUnblock, onDelete }) {
    return [
        { key: 'settings', label: 'Настройки профиля', icon: Settings, onClick: onSettings },
        status === 'blocked'
            ? { key: 'unblock', label: 'Разблокировать', icon: LockOpen, onClick: onUnblock }
            : { key: 'block', label: 'Заблокировать', icon: Lock, onClick: onBlock },
        { key: 'delete', label: 'Удалить', icon: Trash2, onClick: onDelete, danger: true },
    ]
}
