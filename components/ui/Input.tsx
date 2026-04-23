import { InputHTMLAttributes, TextareaHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  textarea?: false
}

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  helperText?: string
  textarea: true
}

type Props = InputProps | TextareaProps

export default function Input({ label, error, helperText, textarea, ...props }: Props) {
  const base = `w-full px-4 py-2.5 border rounded-lg text-sm font-normal transition-all outline-none
    ${error
      ? 'border-red-400 focus:ring-2 focus:ring-red-200'
      : 'border-gray-200 focus:border-[#00A3FF] focus:ring-2 focus:ring-blue-100'
    }`

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-sm font-semibold text-gray-700">
          {label}
          {(props as InputProps).required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      {textarea ? (
        <textarea
          {...(props as TextareaHTMLAttributes<HTMLTextAreaElement>)}
          className={`${base} resize-none`}
          rows={4}
        />
      ) : (
        <input
          {...(props as InputHTMLAttributes<HTMLInputElement>)}
          className={base}
        />
      )}
      {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
      {helperText && !error && <p className="text-xs text-gray-400">{helperText}</p>}
    </div>
  )
}