using System.Text;
using ClosedXML.Excel;
using Microsoft.AspNetCore.Mvc;
using TimeTracker.Absctration;
using TimeTracker.Models;
using TimeTracker.Utils.WorkedHoursCalculation;

namespace TimeTracker.Controllers;

public class ExcelController:Controller
{
    private readonly IGenericRepository<User> _repository;
    
    private readonly WorkedHoursHelpers _hoursHelpers;
    
    public ExcelController(IUnitOfWorkRepository uow,WorkedHoursHelpers hoursHelpers)
    {
        _repository = uow.GenericRepository<User>();
        _hoursHelpers = hoursHelpers;
    }
    
    [HttpGet("upload")]
    public async Task<IActionResult> Cvs()
    {
        var users = await _repository.GetAsync(includeProperties:"WorkedHours");
        
        using var workbook = new XLWorkbook();
        var worksheet = workbook.Worksheets.Add("Users");
        var currentRow = 1;
        
        worksheet.Cell(currentRow, 1).Value = "FirstName";
        worksheet.Cell(currentRow, 2).Value = "LastName";
        worksheet.Cell(currentRow, 3).Value = "Email";
        worksheet.Cell(currentRow, 4).Value = "Need to work";
        worksheet.Cell(currentRow, 5).Value = "Actually worked";
        worksheet.Cell(currentRow, 6).Value = "Actually worked %";
        var workedDays = await _hoursHelpers.GetWorkedDaysInMonthAsync(DateTime.Now.Year, DateTime.Now.Month);
        foreach (var user in users)
        {
            currentRow++;
            worksheet.Cell(currentRow, 1).Value = user.FirstName;
            worksheet.Cell(currentRow, 2).Value = user.LastName;
            worksheet.Cell(currentRow, 3).Value = user.Email;
            var needToWork = _hoursHelpers.GetWorkedHoursInCurrentMonth(user,workedDays);
            var actuallyWorked = _hoursHelpers.GetActuallyWorkedHoursInCurrentMonth(user);
            worksheet.Cell(currentRow, 4).Value = $"{needToWork} h";
            worksheet.Cell(currentRow, 4).Value = $"{needToWork} h";
            worksheet.Cell(currentRow, 5).Value = $"{actuallyWorked.TotalHours:F2} h";
            worksheet.Cell(currentRow, 6).Value = $"{(actuallyWorked.TotalHours * 100 / needToWork):F2}%";
            
            worksheet.Cell(currentRow, 1).WorksheetColumn().Width = 30;
            worksheet.Cell(currentRow, 2).WorksheetColumn().Width = 30;
            worksheet.Cell(currentRow, 3).WorksheetColumn().Width = 30;
            worksheet.Cell(currentRow, 4).WorksheetColumn().Width = 30;
            worksheet.Cell(currentRow, 5).WorksheetColumn().Width = 30;
            worksheet.Cell(currentRow, 6).WorksheetColumn().Width = 30;
        }

        using var stream = new MemoryStream();
        workbook.SaveAs(stream);
        var content = stream.ToArray();

        return File(content, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "users.xlsx");
    }
}