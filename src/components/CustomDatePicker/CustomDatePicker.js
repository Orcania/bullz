import React from 'react'
import DatePicker from 'react-datepicker'

const CustomDatePicker = (props) => {

  return (
    <DatePicker
      {...props}
      className='date-picker form-control'
    />
  )
}

export default React.memo(CustomDatePicker);
