import React from 'react'

// Figma: 1920 kanvas → kontent aynan 1340px (chap/o'ngda 290px), mobil → 12px.
// max-w 1388 = 1340 kontent + 2×24 gorizontal padding, shunda katta ekranda
// kontent kengligi Figma bilan bir xil bo'ladi.
export default function Container({ children, className = '', as: Tag = 'div' }) {
    return (
        <Tag className={`mx-auto w-full max-w-[1388px] px-[12px] lg:px-6 ${className}`}>
            {children}
        </Tag>
    )
}
