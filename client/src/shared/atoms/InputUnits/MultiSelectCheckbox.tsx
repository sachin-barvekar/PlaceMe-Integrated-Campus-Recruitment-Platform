import React from 'react'
import { Field, FieldProps } from 'formik'
import './MultiSelectCheckbox.scss'

interface Option {
  label: string;
  value: string;
}

interface MultiSelectCheckboxProps {
  name: string;
  options: Option[];
  isDisabled?: boolean;
  direction?: 'vertical' | 'horizontal';
}

const MultiSelectCheckbox: React.FC<MultiSelectCheckboxProps> = ({
  name,
  options,
  isDisabled,
  direction = 'vertical'
}: MultiSelectCheckboxProps) => {
  return (
    <Field name={name}>
      {({ field, form }: FieldProps) => {
        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const { value } = e.target
          const set = new Set(field.value)

          if (set.has(value)) {
            set.delete(value)
          } else {
            set.add(value)
          }

          form.setFieldValue(name, Array.from(set))
        }

        return (
          <div className={`multi-select-checkbox ${direction}`}>
            {options.map((option) => {
              const id = `${name}-${option.value}`
              return (
                <div key={option.value} className="checkbox">
                  <input
                    type="checkbox"
                    id={id}
                    value={option.value}
                    checked={(field.value || []).includes(option.value)}
                    onChange={handleChange}
                    disabled={isDisabled}
                    data-testid={id}
                  />
                  <label htmlFor={id} className="checkbox__label">
                    {option.label}
                  </label>
                </div>
              )
            })}
          </div>
        )
      }}
    </Field>
  )
}

export default MultiSelectCheckbox
