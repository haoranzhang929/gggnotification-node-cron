type BinType = 'LANDFILL' | 'ORGANIC_RECYCLING' | 'NONE';

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
      2: 'LANDFILL',
      9: 'ORGANIC_RECYCLING',
      16: 'LANDFILL',
      23: 'ORGANIC_RECYCLING',
      30: 'LANDFILL',
    },
    2: {
      6: 'ORGANIC_RECYCLING',
      13: 'LANDFILL',
      20: 'ORGANIC_RECYCLING',
      27: 'LANDFILL',
    },
    3: {
      5: 'ORGANIC_RECYCLING',
      12: 'LANDFILL',
      19: 'ORGANIC_RECYCLING',
      26: 'LANDFILL',
    },
    4: {
      2: 'ORGANIC_RECYCLING',
      9: 'LANDFILL',
      16: 'ORGANIC_RECYCLING',
      23: 'LANDFILL',
      30: 'ORGANIC_RECYCLING',
    },
    5: {
      7: 'LANDFILL',
      14: 'ORGANIC_RECYCLING',
      21: 'LANDFILL',
      28: 'ORGANIC_RECYCLING',
    },
    6: {
      4: 'LANDFILL',
      11: 'ORGANIC_RECYCLING',
      18: 'LANDFILL',
      25: 'ORGANIC_RECYCLING',
    },
    7: {
      2: 'LANDFILL',
      9: 'ORGANIC_RECYCLING',
      16: 'LANDFILL',
      23: 'ORGANIC_RECYCLING',
      30: 'LANDFILL',
    },
    8: {
      6: 'ORGANIC_RECYCLING',
      13: 'LANDFILL',
      20: 'ORGANIC_RECYCLING',
      27: 'LANDFILL',
    },
    9: {
      3: 'ORGANIC_RECYCLING',
      10: 'LANDFILL',
      17: 'ORGANIC_RECYCLING',
      24: 'LANDFILL',
    },
    10: {
      1: 'ORGANIC_RECYCLING',
      8: 'LANDFILL',
      15: 'ORGANIC_RECYCLING',
      22: 'LANDFILL',
      29: 'ORGANIC_RECYCLING',
    },
    11: {
      5: 'LANDFILL',
      12: 'ORGANIC_RECYCLING',
      19: 'LANDFILL',
      26: 'ORGANIC_RECYCLING',
    },
    12: {
      3: 'LANDFILL',
      10: 'ORGANIC_RECYCLING',
      17: 'LANDFILL',
      24: 'ORGANIC_RECYCLING',
      31: 'LANDFILL',
    },
  },
};

export { scheduleData };
