function StLukesCycles() {
  // today's date
  this.currentDate = new Date();
  // any Friday pay day in the past (Oct 31, 2008 at morning midnight)
  this.startPayDay = Date.parse("Oct 31, 2008 00:00:00");
  // days prior to but not including payday that will be considered "during payroll"
  this.payrollDays = 3;
  // days prior to but not including payday that will be considered start of personnel action range
  this.personnelStart = 4;
  this.personnelEnd = 1;
  // time constants
  this.MS_PER_SEC = 1000; this.SEC_PER_MIN = 60; this.MIN_PER_HR = 60; this.HR_PER_DAY = 24;
  this.MS_PER_DAY = this.MS_PER_SEC * this.SEC_PER_MIN * this.MIN_PER_HR * this.HR_PER_DAY;
  // find the difference in seconds between now and the start pay day
  this.currentms = this.currentDate.getTime();
  // to test using a particular date, uncomment the following line
  //this.currentms = Date.parse("Jan 17, 2010 00:00:00");
  this.diffms = this.currentms - this.startPayDay;  
}

// find if today is in the middle of payroll running
//   (14*N-this.payrollDays days from a previous pay day where N is an integer)
StLukesCycles.prototype.isPayrollRunningToday = function() {
  // find the remainder of 14 days starting with a pay day
  // the remainder normalizes current time to the ms offset within a 2 week period
  this.remainderms = this.diffms % ( 14 * this.MS_PER_DAY );
  // we want to find the offset where payroll starts
  this.payrollstart = (14 - this.payrollDays) * this.MS_PER_DAY;
  // if the current time is past the payrollstart, then payroll is running
  return (this.remainderms >= this.payrollstart);
}

// find if today is a pay day (14*N days from a previous pay day where N is an integer)
StLukesCycles.prototype.isPayDayToday = function() {
  // find the remainder of 14 days starting with a pay day
  // the remainder normalizes current time to the ms offset within a 2 week period
  this.remainderms = this.diffms % ( 14 * this.MS_PER_DAY );
  // if the remainder is less than 1 day, then today is a pay day
  return (this.remainderms < this.MS_PER_DAY);
}

// find if today is in the middle of when personnel actions should not be entered
//   (between 14*N-this.personnelStart days and 14*N-this.personnelEnd days 
//    from a previous pay day where N is an integer)
StLukesCycles.prototype.isPersonnelClosedToday = function() {
  // find the remainder of 14 days starting with a pay day
  // the remainder normalizes current time to the ms offset within a 2 week period
  this.remainderms = this.diffms % ( 14 * this.MS_PER_DAY );
  // we want to find the range where personnel actions stop
  this.pstart = (14 - this.personnelStart) * this.MS_PER_DAY;
  this.pend =   (14 - this.personnelEnd  ) * this.MS_PER_DAY;
  // if the current time is within the range, then personnel actions should not be allowed
  return (this.pstart <= this.remainderms && this.remainderms <= this.pend);
}