const cds = require('@sap/cds')

module.exports = cds.service.impl(function () {
    let { Test } = this.entities;

    this.before('READ', Test, async (req) => {
        // Parse begin_date and end_date strings into Date objects
        var begin_date_parts = "22/4/2024, 5:30:00 PM".split(/\/|, |:| /); // Split the string
        var end_date_parts = "25/4/2024, 5:30:00 PM".split(/\/|, |:| /); // Split the string

        // Date constructor takes year, month (0-based), day, hours, minutes, seconds, milliseconds
        var begin_Date_Time = new Date(begin_date_parts[2], begin_date_parts[1] - 1, begin_date_parts[0],
            begin_date_parts[3] + (begin_date_parts[6] === "PM" ? 12 : 0), begin_date_parts[4], begin_date_parts[5]);

        var end_Date_Time = new Date(end_date_parts[2], end_date_parts[1] - 1, end_date_parts[0],
            end_date_parts[3] + (end_date_parts[6] === "PM" ? 12 : 0), end_date_parts[4], end_date_parts[5]);

        // Convert begin_Date_Time and end_Date_Time to India Standard Time (IST)
        begin_Date_Time.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
        end_Date_Time.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });

        // Calculate the difference between the two dates in milliseconds
        var timeDifference = end_Date_Time.getTime() - begin_Date_Time.getTime();

        // Calculate the number of days between the two dates
        var daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

        console.log("Begin Date (IST):", begin_Date_Time.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }));
        console.log("End Date (IST):", end_Date_Time.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }));
        console.log("Days Difference:", daysDifference);

    })

})