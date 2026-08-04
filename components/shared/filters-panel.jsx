'use client'

import React, { useState } from 'react'
import { FiFilter, FiX } from 'react-icons/fi'
import Button from '@/components/ui/button'
import Checkbox from '@/components/ui/checkbox'
import RangeInput from '@/components/ui/range-input'
import SearchInput from '@/components/ui/search-input'
import Select from '@/components/ui/select'

// Figma: Фильтры (360:22138) + Возраст (360:21739).
// `fields` — qaysi filtrlar ko'rinishini boshqaradi, chunki
// modellar / площадки / проекты uchun to'plam har xil.

const CITY_OPTIONS = [
    { label: 'Москва', value: 'moscow' },
    { label: 'Санкт-Петербург', value: 'spb' },
    { label: 'Казань', value: 'kazan' },
    { label: 'Екатеринбург', value: 'ekb' },
]

const GENDER_OPTIONS = [
    { label: 'Любой', value: '' },
    { label: 'Женский', value: 'female' },
    { label: 'Мужской', value: 'male' },
]

const SORT_OPTIONS = [
    { label: 'Популярные', value: 'popular' },
    { label: 'Новые', value: 'new' },
    { label: 'Сначала дешёвые', value: 'price_asc' },
    { label: 'Сначала дорогие', value: 'price_desc' },
    { label: 'По рейтингу', value: 'rating' },
]

function Panel({ filters, fields, categories, onChange, onReset, onApply }) {
    return (
        <div className="flex flex-col gap-6">
            <SearchInput
                value={filters.search}
                onChange={(v) => onChange({ search: v })}
            />

            {fields.includes('city') && (
                <Select
                    label="Город"
                    value={filters.city}
                    options={CITY_OPTIONS}
                    placeholder="Любой город"
                    onChange={(v) => onChange({ city: v })}
                />
            )}

            {fields.includes('gender') && (
                <Select
                    label="Пол"
                    value={filters.gender}
                    options={GENDER_OPTIONS}
                    onChange={(v) => onChange({ gender: v })}
                />
            )}

            {fields.includes('age') && (
                <RangeInput
                    label="Возраст"
                    from={filters.ageFrom}
                    to={filters.ageTo}
                    suffix="лет"
                    onChange={({ from, to }) => onChange({ ageFrom: from, ageTo: to })}
                />
            )}

            {fields.includes('height') && (
                <RangeInput
                    label="Рост"
                    from={filters.heightFrom}
                    to={filters.heightTo}
                    suffix="см"
                    onChange={({ from, to }) => onChange({ heightFrom: from, heightTo: to })}
                />
            )}

            {fields.includes('price') && (
                <RangeInput
                    label="Стоимость"
                    from={filters.priceFrom}
                    to={filters.priceTo}
                    suffix="₽"
                    onChange={({ from, to }) => onChange({ priceFrom: from, priceTo: to })}
                />
            )}

            {fields.includes('categories') && categories?.length > 0 && (
                <div className="flex flex-col gap-3">
                    <span className="text-sm text-grey">Категории</span>
                    <div className="custom-scrollbar flex max-h-60 flex-col gap-3 overflow-y-auto pr-1">
                        {categories.map((c) => (
                            <Checkbox
                                key={c.value}
                                label={c.label}
                                count={c.count}
                                checked={filters.categories?.includes(c.value)}
                                onChange={(checked) =>
                                    onChange({
                                        categories: checked
                                            ? [...(filters.categories || []), c.value]
                                            : (filters.categories || []).filter((v) => v !== c.value),
                                    })
                                }
                            />
                        ))}
                    </div>
                </div>
            )}

            <Select
                label="Сортировка"
                value={filters.sort}
                options={SORT_OPTIONS}
                onChange={(v) => onChange({ sort: v })}
            />

            <div className="flex flex-col gap-3">
                {onApply && <Button onClick={onApply} full>Применить</Button>}
                <Button variant="ghost" onClick={onReset} full>
                    Сбросить
                </Button>
            </div>
        </div>
    )
}

export default function FiltersPanel({
    filters,
    onChange,
    onReset,
    categories = [],
    fields = ['city', 'gender', 'age', 'height', 'price', 'categories'],
}) {
    const [open, setOpen] = useState(false)

    return (
        <>
            {/* Desktop — yon panel */}
            <div className="hidden rounded-[16px] border border-black/8 bg-white p-6 lg:block">
                <Panel
                    filters={filters}
                    fields={fields}
                    categories={categories}
                    onChange={onChange}
                    onReset={onReset}
                />
            </div>

            {/* Mobil — pastdan ochiladigan panel */}
            <Button
                variant="whiteStroke"
                icon={<FiFilter />}
                onClick={() => setOpen(true)}
                className="lg:hidden"
            >
                Фильтры
            </Button>

            {open && (
                <div
                    className="fixed inset-0 z-[100] flex bg-black/40 backdrop-blur-[2px] lg:hidden"
                    onClick={() => setOpen(false)}
                >
                    <div
                        className="custom-scrollbar ml-auto h-full w-[90%] max-w-[420px] overflow-y-auto bg-white"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="sticky top-0 flex items-center justify-between border-b border-black/8 bg-white p-4">
                            <h2 className="text-xl text-black">Фильтры</h2>
                            <button
                                type="button"
                                onClick={() => setOpen(false)}
                                className="p-2 text-grey hover:text-black"
                                aria-label="Закрыть"
                            >
                                <FiX size={22} />
                            </button>
                        </div>
                        <div className="p-4">
                            <Panel
                                filters={filters}
                                fields={fields}
                                categories={categories}
                                onChange={onChange}
                                onReset={onReset}
                                onApply={() => setOpen(false)}
                            />
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
