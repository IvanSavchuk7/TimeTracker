import moment from 'moment';
import { AjaxQuery } from './query';
import { WorkPlan, CalendarEvent, DateRangeType, SetWorkPlanType, SetCalendarEventType, FetchUsersPlansType, SchedulerWorkPlan, DeleteWorkPlanType } from '@redux/types';

export function FetchCalendarEventsQuery(dateRange: DateRangeType) {
  return AjaxQuery<{ calendarEventQuery: { calendarEvents: CalendarEvent[] } }>(
    `query GetCalendarEvents($dateRange: DateRangeInputType!) {
            calendarEventQuery {
              calendarEvents(dateRange: $dateRange) {
                id
                date
                title
                eventType
              }
            }
          }`,
    { dateRange: dateRange },
  );
}

export function FetchWorkPlansQuery(data: FetchUsersPlansType) {
  const { dateRange, userIds } = data;

  return AjaxQuery<{ workPlanQuery: { workPlans: WorkPlan[] } }>(
    `query GetWorkPlans($userIds: [Int!]!, $dateRange: DateRangeInputType!) {
            workPlanQuery {
              workPlans(userIds: $userIds, dateRange: $dateRange) {
                id
                userId
                firstName
                lastName
                date
                startTime
                endTime
              }
            }
          }`,
    {
      userIds: userIds,
      dateRange: dateRange
    },
  );
}

export function SetWorkPlanQuery(workPlan: SetWorkPlanType) {
  //const token = ReadCookie('user');

  return AjaxQuery<{ workPlanMutations: { set: WorkPlan } }>(
    `mutation SetWorkPlan($workPlan: WorkPlanInputType!) {
      workPlanMutations {
        set(workPlan: $workPlan) {
          id
          userId
          date
          startTime
          endTime
        }
      }
    }`,
    { workPlan: workPlan },
    //token
  )
}

export function SetCalendarEventQuery(calendarEvent: SetCalendarEventType) {
  //const token = ReadCookie('user');

  return AjaxQuery<{ calendarEventMutations: { set: CalendarEvent } }>(
    `mutation SetCalendarEvent($calendarEvent: CalendarEventInputType!) {
      calendarEventMutations {
        set(calendarEvent: $calendarEvent) {
          id
          date
          title
          eventType
        }
      }
    }`,
    { calendarEvent: calendarEvent },
    //token
  )
}

export function DeleteWorkPlanQuery(workPlan: SchedulerWorkPlan) {
  //const token = ReadCookie('user');
  const dateMoment = moment(workPlan.date);
  const arg: DeleteWorkPlanType = {
    id: workPlan.id,
    date: dateMoment.format("YYYY-MM-DD"),
    userId: workPlan.userId,
    startTime: "", //! empty string test
    endTime: ""
  }

  return AjaxQuery<{ workPlanMutations: { delete: WorkPlan | null } }>(
    `mutation DeleteWorkPlan($workPlan: WorkPlanInputType!) {
      workPlanMutations {
        delete(workPlan: $workPlan) {
          id
          userId
          date
          startTime
          endTime
        }
      }
    }
    `,
    { workPlan: arg },
    //token
  )
}