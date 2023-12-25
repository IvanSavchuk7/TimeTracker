using AutoMapper;
using TimeTracker.Models;
using TimeTracker.Models.Dtos;

namespace TimeTracker.MapperProfiles;

public class WorkedHourProfile : Profile
{

    public WorkedHourProfile()
    {
        CreateMap<WorkedHourInputDto, WorkedHour>()
            .ForMember(x => x.TotalTime,
                o =>
                    o.MapFrom(src => (int)(src.EndDate - src.StartDate).TotalSeconds));
            
        CreateMap<WorkedHourUpdateDto, WorkedHour>()
            .ForMember(x => x.Id,
                o => o.UseDestinationValue())
            .ForMember(x => x.TotalTime,
                o =>
                    o.MapFrom(src => (int)(src.EndDate - src.StartDate).TotalSeconds));
    }
}
