type BinType = 'RECYCLING' | 'LANDFILL_ORGANIC' | 'NONE';

type ScheduleData = {
  [year: string]: {
    [month: string]: {
      [day: string]: BinType;
    };
  };
};

const scheduleData: ScheduleData = {
  2024: {
    1: {
      2: 'RECYCLING',
      9: 'LANDFILL_ORGANIC',
      16: 'RECYCLING',
      23: 'LANDFILL_ORGANIC',
      30: 'RECYCLING',
    },
    2: {
      6: 'LANDFILL_ORGANIC',
      13: 'RECYCLING',
      20: 'LANDFILL_ORGANIC',
      27: 'RECYCLING',
    },
    3: {
      5: 'LANDFILL_ORGANIC',
      12: 'RECYCLING',
      19: 'LANDFILL_ORGANIC',
      26: 'RECYCLING',
    },
    4: {
      2: 'LANDFILL_ORGANIC',
      9: 'RECYCLING',
      16: 'LANDFILL_ORGANIC',
      23: 'RECYCLING',
      30: 'LANDFILL_ORGANIC',
    },
    5: {
      7: 'RECYCLING',
      14: 'LANDFILL_ORGANIC',
      21: 'RECYCLING',
      28: 'LANDFILL_ORGANIC',
    },
    6: {
      4: 'RECYCLING',
      11: 'LANDFILL_ORGANIC',
      18: 'RECYCLING',
      25: 'LANDFILL_ORGANIC',
    },
    7: {
      2: 'RECYCLING',
      9: 'LANDFILL_ORGANIC',
      16: 'RECYCLING',
      23: 'LANDFILL_ORGANIC',
      30: 'RECYCLING',
    },
    8: {
      6: 'LANDFILL_ORGANIC',
      13: 'RECYCLING',
      20: 'LANDFILL_ORGANIC',
      27: 'RECYCLING',
    },
    9: {
      3: 'LANDFILL_ORGANIC',
      10: 'RECYCLING',
      17: 'LANDFILL_ORGANIC',
      24: 'RECYCLING',
    },
    10: {
      1: 'LANDFILL_ORGANIC',
      8: 'RECYCLING',
      15: 'LANDFILL_ORGANIC',
      22: 'RECYCLING',
      29: 'LANDFILL_ORGANIC',
    },
    11: {
      5: 'RECYCLING',
      12: 'LANDFILL_ORGANIC',
      19: 'RECYCLING',
      26: 'LANDFILL_ORGANIC',
    },
    12: {
      3: 'RECYCLING',
      10: 'LANDFILL_ORGANIC',
      17: 'RECYCLING',
      24: 'LANDFILL_ORGANIC',
      31: 'RECYCLING',
    },
  },
  2025: {
    1: {
      7: 'LANDFILL_ORGANIC',
      14: 'RECYCLING',
      21: 'LANDFILL_ORGANIC',
      28: 'RECYCLING',
    },
    2: {
      4: 'LANDFILL_ORGANIC',
      11: 'RECYCLING',
      18: 'LANDFILL_ORGANIC',
      25: 'RECYCLING',
    },
    3: {
      4: 'LANDFILL_ORGANIC',
      11: 'RECYCLING',
      18: 'LANDFILL_ORGANIC',
      25: 'RECYCLING',
    },
    4: {
      1: 'LANDFILL_ORGANIC',
      8: 'RECYCLING',
      15: 'LANDFILL_ORGANIC',
      22: 'RECYCLING',
      29: 'LANDFILL_ORGANIC',
    },
    5: {
      6: 'RECYCLING',
      13: 'LANDFILL_ORGANIC',
      20: 'RECYCLING',
      27: 'LANDFILL_ORGANIC',
    },
    6: {
      3: 'RECYCLING',
      10: 'LANDFILL_ORGANIC',
      17: 'RECYCLING',
      24: 'LANDFILL_ORGANIC',
    },
    7: {
      1: 'RECYCLING',
      8: 'LANDFILL_ORGANIC',
      15: 'RECYCLING',
      22: 'LANDFILL_ORGANIC',
      29: 'RECYCLING',
    },
    8: {
      5: 'LANDFILL_ORGANIC',
      12: 'RECYCLING',
      19: 'LANDFILL_ORGANIC',
      26: 'RECYCLING',
    },
    9: {
      2: 'LANDFILL_ORGANIC',
      9: 'RECYCLING',
      16: 'LANDFILL_ORGANIC',
      23: 'RECYCLING',
      30: 'LANDFILL_ORGANIC',
    },
    10: {
      7: 'RECYCLING',
      14: 'LANDFILL_ORGANIC',
      21: 'RECYCLING',
      28: 'LANDFILL_ORGANIC',
    },
    11: {
      4: 'RECYCLING',
      11: 'LANDFILL_ORGANIC',
      18: 'RECYCLING',
      25: 'LANDFILL_ORGANIC',
    },
    12: {
      2: 'RECYCLING',
      9: 'LANDFILL_ORGANIC',
      16: 'RECYCLING',
      23: 'LANDFILL_ORGANIC',
      30: 'RECYCLING',
    },
  },
};

export { scheduleData };
