import React from 'react'
import cx from 'classnames'
import { FormikInputs } from './interfaces'
import './DOW.scss'

export const daysMap: Record<string, string> = {
  '2': 'M',
  '3': 'Tu',
  '4': 'W',
  '5': 'Th',
  '6': 'F',
  '7': 'Sa',
  '1': 'Su'
}

function DOW<V>(props: Readonly<FormikInputs<V>>): React.ReactElement {
  const { formik, name, isDisabled } = props
  const selectedValues = (formik?.values as Record<string, any>)[name] || ''

  const handleDayClick = (value: string) => {
    const currentSelection = !selectedValues ? [] : selectedValues.split(',')
    let updatedSelection

    if (currentSelection.includes(value)) {
      updatedSelection = currentSelection.filter((day: string) => day !== value)
    } else {
      updatedSelection = [...currentSelection, value]
    }

    const newValues = updatedSelection.join(',')
    formik?.setFieldValue(name, newValues)
  }

  return (
    <div className="dow-container">
      {Object.entries(daysMap).map(([value, label]) => (
        <button
          key={value}
          type="button"
          className={cx('day-button', {
            selectedDay: selectedValues.split(',').includes(value),
            disabledDay: isDisabled
          })}
          onClick={() => !isDisabled && handleDayClick(value)}
        >
          {label}
        </button>
      ))}
    </div>
  )
}

export default DOW
