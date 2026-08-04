'use client'

import React from 'react'
import { FiCheck } from 'react-icons/fi'

// Ko'p bosqichli formalar: анкета исполнителя, новый проект, новая площадка.
// steps: [{ label, href? }]
export default function Stepper({ steps = [], current = 0 }) {
    return (
        <ol className="scrollbar-hide mb-8 flex gap-2 overflow-x-auto">
            {steps.map((step, idx) => {
                const done = idx < current
                const active = idx === current
                return (
                    <li key={step.label} className="flex shrink-0 items-center gap-2">
                        <span
                            className={[
                                'flex h-8 w-8 items-center justify-center rounded-full text-sm transition-colors',
                                done
                                    ? 'bg-gold text-white'
                                    : active
                                      ? 'border border-gold text-gold'
                                      : 'border border-black/15 text-grey',
                            ].join(' ')}
                        >
                            {done ? <FiCheck size={14} /> : idx + 1}
                        </span>
                        <span
                            className={`whitespace-nowrap text-sm ${active ? 'text-black' : 'text-grey'}`}
                        >
                            {step.label}
                        </span>
                        {idx < steps.length - 1 && (
                            <span className="mx-2 h-px w-8 bg-black/10" />
                        )}
                    </li>
                )
            })}
        </ol>
    )
}
