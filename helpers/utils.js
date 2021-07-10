export const isValidMobileNo = (mobileNo) => /^\d{10}$/.test(mobileNo);

export const getPeriodTimeStamp = (specifiedPeriod) => {
    const currentDate = new Date();
    const specifiedPeriodTimeStampObject = {
      'today': 1,
      'week': 7,
      'fortnight': 14,
      'month': 30,
      '3_months': 90,
      '6_months': 180
    };
    return currentDate.setDate(currentDate.getDate() - specifiedPeriodTimeStampObject[specifiedPeriod]);
  }
