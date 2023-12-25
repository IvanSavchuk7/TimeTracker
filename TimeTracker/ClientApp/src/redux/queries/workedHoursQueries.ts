import { CreateWorkedHourType, DateRangeType, UpdateWorkedHourType, WorkedHour, WorkedHoursStatistic } from '@redux/types';
import moment from "moment";
import { AjaxQuery } from './query';

export function FetchWorkedHoursQuery(data: {
  userId: number,
  dateRange: DateRangeType
}) {
  const { userId, dateRange } = data;

  return AjaxQuery<{ workedHourQuery: { workedHours: WorkedHour[] } }>(
    `query GetUserWorkedHours(
      $userId: Int!
      $dateRange: DateRangeInputType
    ) {
      workedHourQuery {
        workedHours(
          userId: $userId
          dateRange: $dateRange
        ) {
          id
          userId
          startDate
          endDate
          totalTime
        }
      }
    }`,
    {
      userId: userId,
      dateRange: dateRange,
    },
  );
}

export function UpdateWorkedHoursQuery(workedHour: UpdateWorkedHourType) {
  return AjaxQuery<{ workedHourMutations: { update: WorkedHour } }>(
    `mutation UpdateWorkedHours($workedHour: UpdateWorkedHourInputType!) {
      workedHourMutations {
        update(workedHour: $workedHour) {
          id
          userId
          startDate
          endDate
          totalTime
        }
      }
    }`,
    { workedHour: workedHour },
  );
}

export function DeleteWorkedHoursQuery(id: number) {
  return AjaxQuery<{ workedHourMutations: { delete: number } }>(
    `mutation DeleteWorkedHours($id: Int!) {
      workedHourMutations {
        delete(id: $id)
      }
    }`,
    { id: id },
  );
}

export function CreateWorkedHoursQuery(workedHour: CreateWorkedHourType) {
  //const token = ReadCookie('user');

  return AjaxQuery<{ workedHourMutations: { create: WorkedHour } }>(
    `mutation CreateWorkedHour($workedHour: WorkedHourInputType!) {
      workedHourMutations {
        create(workedHour: $workedHour) {
          id
          userId
          startDate
          endDate
          totalTime
        }
      }
    }`,
    { workedHour: workedHour },
    //token
  )
}

export function WorkedHoursStatistic(userId: number, date: Date) {
  return AjaxQuery<{ workedHourQuery: { getYearStatistic: WorkedHoursStatistic } }>(
    `query GetWorkedHours($id:Int!,$date:DateOnly!){
        workedHourQuery{
          getYearStatistic(userId:$id,date:$date){
            actuallyWorked,
            actuallyWorkedToday,
            needToWorkToday,
            needToWork
          }
        }
      }`,
    { date: moment(date).format("YYYY-MM-DD"), id: userId },
  )
}
