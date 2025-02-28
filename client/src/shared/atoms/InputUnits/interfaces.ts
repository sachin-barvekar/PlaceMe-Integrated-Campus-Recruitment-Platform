import { FormikProps } from 'formik'
import { DropdownProps, RadioGroupProps } from 'rsuite'

export interface InputAs {
  TEXTAREA: 'textarea';
}
export interface FormikInputs<FormValues>
  extends Pick<
    InputProps,
    'as' | 'isDisabled' | 'dataType' | 'placeholder' | 'className' | 'rows'
  > {
  formik?: FormikProps<FormValues>;
  name: string;
  id?: string;
}

export interface InputProps {
  inputType?: 'INPUT' | 'CHECKBOX' | 'SELECT' | 'RADIO' | 'DATE' | 'DOW';
  dataType?: 'boolean' | 'string' | 'number' | 'email' | 'password' | 'text';
  as?: InputAs['TEXTAREA'];
  rows?: number;
  allowedValue?: Array<string>;
  selectOptions?: Array<{
    label: JSX.Element | string,
    value: string | number
  }>;
  hideLabel?: boolean;
  isDisabled?: boolean;
  className?: string;
  placeholder?: string;
  hideButton?: boolean;
}

export interface FormikSelectInputs<V> extends DropdownProps {
  formik?: FormikProps<V>;
  name: string;
  allowedValue?: Array<string>;
  inputProps: InputProps;
}

export interface FormikRadioInputs<V> extends RadioGroupProps {
  formik?: FormikProps<V>;
  name: string;
  allowedValue?: Array<string>;
  inputProps: InputProps;
}
