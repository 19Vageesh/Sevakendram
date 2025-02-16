import React, { useState } from 'react';
import { Clock, Calendar, Utensils, Star, Users, MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';

interface MealTime {
  time: string;
  menu: {
    regular: string[];
    special?: string[];
  };
}

interface DayMenu {
  breakfast: MealTime;
  lunch: MealTime;
  dinner: MealTime;
}

interface MessStaff {
  role: string;
  name: string;
  contact: string;
}

interface Mess {
  id: string;
  name: string;
  image: string;
  description: string;
  staff: MessStaff[];
  menu: Record<string, DayMenu>;
}

const MESSES: Mess[] = [
  {
    id: 'ifc-a',
    name: 'IFC-A Mess',
    image: 'https://images.unsplash.com/photo-1544148103-0773bf10d330?auto=format&fit=crop&w=800&q=80',
    description: 'Institute Food Court A - Main Campus',
    staff: [
      { role: 'Mess Manager', name: 'Mr. Rajesh Kumar', contact: '+91 9876543210' },
      { role: 'Head Chef', name: 'Mr. Suresh Patel', contact: '+91 9876543211' },
      { role: 'Quality Supervisor', name: 'Ms. Priya Singh', contact: '+91 9876543212' }
    ],
    menu: {
      Monday: {
        breakfast: {
          time: '7:00 AM - 9:00 AM',
          menu: {
            regular: ['Idli Sambar', 'Chutney', 'Boiled Eggs', 'Tea/Coffee', 'Bread', 'Butter', 'Jam'],
            special: ['Sprouts', 'Cornflakes']
          }
        },
        lunch: {
          time: '12:00 PM - 2:00 PM',
          menu: {
            regular: ['Rice', 'Dal', 'Mixed Veg Curry', 'Curd', 'Pickle', 'Papad', 'Salad', 'Chapati'],
            special: ['Sweet: Gulab Jamun']
          }
        },
        dinner: {
          time: '7:00 PM - 9:00 PM',
          menu: {
            regular: ['Chapati', 'Paneer Butter Masala', 'Rice', 'Dal Fry', 'Salad', 'Pickle']
          }
        }
      },
      Tuesday: {
        breakfast: {
          time: '7:00 AM - 9:00 AM',
          menu: {
            regular: ['Poha', 'Upma', 'Boiled Eggs', 'Tea/Coffee', 'Bread', 'Butter', 'Jam'],
            special: ['Fruit Bowl', 'Cornflakes']
          }
        },
        lunch: {
          time: '12:00 PM - 2:00 PM',
          menu: {
            regular: ['Rice', 'Dal Tadka', 'Aloo Gobi', 'Curd', 'Pickle', 'Papad', 'Salad', 'Chapati'],
            special: ['Sweet: Kheer']
          }
        },
        dinner: {
          time: '7:00 PM - 9:00 PM',
          menu: {
            regular: ['Chapati', 'Chicken Curry', 'Rice', 'Dal Fry', 'Salad', 'Pickle']
          }
        }
      },
      Wednesday: {
        breakfast: {
          time: '7:00 AM - 9:00 AM',
          menu: {
            regular: ['Dosa', 'Sambar', 'Chutney', 'Boiled Eggs', 'Tea/Coffee', 'Bread'],
            special: ['Oats', 'Cornflakes']
          }
        },
        lunch: {
          time: '12:00 PM - 2:00 PM',
          menu: {
            regular: ['Rice', 'Dal', 'Bhindi Masala', 'Curd', 'Pickle', 'Papad', 'Salad', 'Chapati'],
            special: ['Sweet: Jalebi']
          }
        },
        dinner: {
          time: '7:00 PM - 9:00 PM',
          menu: {
            regular: ['Chapati', 'Egg Curry', 'Rice', 'Dal Fry', 'Salad', 'Pickle']
          }
        }
      },
      Thursday: {
        breakfast: {
          time: '7:00 AM - 9:00 AM',
          menu: {
            regular: ['Puri', 'Aloo Bhaji', 'Boiled Eggs', 'Tea/Coffee', 'Bread'],
            special: ['Sprouts', 'Cornflakes']
          }
        },
        lunch: {
          time: '12:00 PM - 2:00 PM',
          menu: {
            regular: ['Rice', 'Dal', 'Cabbage Curry', 'Curd', 'Pickle', 'Papad', 'Salad', 'Chapati'],
            special: ['Sweet: Rasmalai']
          }
        },
        dinner: {
          time: '7:00 PM - 9:00 PM',
          menu: {
            regular: ['Chapati', 'Mixed Veg Curry', 'Rice', 'Dal Fry', 'Salad', 'Pickle']
          }
        }
      },
      Friday: {
        breakfast: {
          time: '7:00 AM - 9:00 AM',
          menu: {
            regular: ['Uttapam', 'Sambar', 'Chutney', 'Boiled Eggs', 'Tea/Coffee', 'Bread'],
            special: ['Fruit Bowl', 'Cornflakes']
          }
        },
        lunch: {
          time: '12:00 PM - 2:00 PM',
          menu: {
            regular: ['Rice', 'Dal', 'Paneer Curry', 'Curd', 'Pickle', 'Papad', 'Salad', 'Chapati'],
            special: ['Sweet: Rasgulla']
          }
        },
        dinner: {
          time: '7:00 PM - 9:00 PM',
          menu: {
            regular: ['Chapati', 'Fish Curry', 'Rice', 'Dal Fry', 'Salad', 'Pickle']
          }
        }
      },
      Saturday: {
        breakfast: {
          time: '7:00 AM - 9:00 AM',
          menu: {
            regular: ['Paratha', 'Aloo Curry', 'Boiled Eggs', 'Tea/Coffee', 'Bread'],
            special: ['Sprouts', 'Cornflakes']
          }
        },
        lunch: {
          time: '12:00 PM - 2:00 PM',
          menu: {
            regular: ['Rice', 'Dal', 'Rajma', 'Curd', 'Pickle', 'Papad', 'Salad', 'Chapati'],
            special: ['Sweet: Gajar Ka Halwa']
          }
        },
        dinner: {
          time: '7:00 PM - 9:00 PM',
          menu: {
            regular: ['Chapati', 'Chicken Biryani', 'Raita', 'Salad', 'Pickle']
          }
        }
      },
      Sunday: {
        breakfast: {
          time: '7:00 AM - 9:00 AM',
          menu: {
            regular: ['Chole Bhature', 'Boiled Eggs', 'Tea/Coffee', 'Bread'],
            special: ['Fruit Bowl', 'Cornflakes']
          }
        },
        lunch: {
          time: '12:00 PM - 2:00 PM',
          menu: {
            regular: ['Rice', 'Dal Makhani', 'Shahi Paneer', 'Curd', 'Pickle', 'Papad', 'Salad', 'Chapati'],
            special: ['Sweet: Ice Cream']
          }
        },
        dinner: {
          time: '7:00 PM - 9:00 PM',
          menu: {
            regular: ['Chapati', 'Mutton Curry', 'Rice', 'Dal Fry', 'Salad', 'Pickle']
          }
        }
      }
    }
  },
  {
    id: 'ifc-b',
    name: 'IFC-B Mess',
    image: 'https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?auto=format&fit=crop&w=800&q=80',
    description: 'Institute Food Court B - Main Campus',
    staff: [
      { role: 'Mess Manager', name: 'Mr. Ramesh Kumar', contact: '+91 9876543213' },
      { role: 'Head Chef', name: 'Mr. Vikram Singh', contact: '+91 9876543214' },
      { role: 'Quality Supervisor', name: 'Ms. Anjali Sharma', contact: '+91 9876543215' }
    ],
    menu: {
      Monday: {
        breakfast: {
          time: '7:00 AM - 9:00 AM',
          menu: {
            regular: ['Idli Sambar', 'Chutney', 'Boiled Eggs', 'Tea/Coffee', 'Bread', 'Butter', 'Jam'],
            special: ['Sprouts', 'Cornflakes']
          }
        },
        lunch: {
          time: '12:00 PM - 2:00 PM',
          menu: {
            regular: ['Rice', 'Dal', 'Mixed Veg Curry', 'Curd', 'Pickle', 'Papad', 'Salad', 'Chapati'],
            special: ['Sweet: Gulab Jamun']
          }
        },
        dinner: {
          time: '7:00 PM - 9:00 PM',
          menu: {
            regular: ['Chapati', 'Paneer Butter Masala', 'Rice', 'Dal Fry', 'Salad', 'Pickle']
          }
        }
      },
      Tuesday: {
        breakfast: {
          time: '7:00 AM - 9:00 AM',
          menu: {
            regular: ['Poha', 'Upma', 'Boiled Eggs', 'Tea/Coffee', 'Bread', 'Butter', 'Jam'],
            special: ['Fruit Bowl', 'Cornflakes']
          }
        },
        lunch: {
          time: '12:00 PM - 2:00 PM',
          menu: {
            regular: ['Rice', 'Dal Tadka', 'Aloo Gobi', 'Curd', 'Pickle', 'Papad', 'Salad', 'Chapati'],
            special: ['Sweet: Kheer']
          }
        },
        dinner: {
          time: '7:00 PM - 9:00 PM',
          menu: {
            regular: ['Chapati', 'Chicken Curry', 'Rice', 'Dal Fry', 'Salad', 'Pickle']
          }
        }
      },
      Wednesday: {
        breakfast: {
          time: '7:00 AM - 9:00 AM',
          menu: {
            regular: ['Dosa', 'Sambar', 'Chutney', 'Boiled Eggs', 'Tea/Coffee', 'Bread'],
            special: ['Oats', 'Cornflakes']
          }
        },
        lunch: {
          time: '12:00 PM - 2:00 PM',
          menu: {
            regular: ['Rice', 'Dal', 'Bhindi Masala', 'Curd', 'Pickle', 'Papad', 'Salad', 'Chapati'],
            special: ['Sweet: Jalebi']
          }
        },
        dinner: {
          time: '7:00 PM - 9:00 PM',
          menu: {
            regular: ['Chapati', 'Egg Curry', 'Rice', 'Dal Fry', 'Salad', 'Pickle']
          }
        }
      },
      Thursday: {
        breakfast: {
          time: '7:00 AM - 9:00 AM',
          menu: {
            regular: ['Puri', 'Aloo Bhaji', 'Boiled Eggs', 'Tea/Coffee', 'Bread'],
            special: ['Sprouts', 'Cornflakes']
          }
        },
        lunch: {
          time: '12:00 PM - 2:00 PM',
          menu: {
            regular: ['Rice', 'Dal', 'Cabbage Curry', 'Curd', 'Pickle', 'Papad', 'Salad', 'Chapati'],
            special: ['Sweet: Rasmalai']
          }
        },
        dinner: {
          time: '7:00 PM - 9:00 PM',
          menu: {
            regular: ['Chapati', 'Mixed Veg Curry', 'Rice', 'Dal Fry', 'Salad', 'Pickle']
          }
        }
      },
      Friday: {
        breakfast: {
          time: '7:00 AM - 9:00 AM',
          menu: {
            regular: ['Uttapam', 'Sambar', 'Chutney', 'Boiled Eggs', 'Tea/Coffee', 'Bread'],
            special: ['Fruit Bowl', 'Cornflakes']
          }
        },
        lunch: {
          time: '12:00 PM - 2:00 PM',
          menu: {
            regular: ['Rice', 'Dal', 'Paneer Curry', 'Curd', 'Pickle', 'Papad', 'Salad', 'Chapati'],
            special: ['Sweet: Rasgulla']
          }
        },
        dinner: {
          time: '7:00 PM - 9:00 PM',
          menu: {
            regular: ['Chapati', 'Fish Curry', 'Rice', 'Dal Fry', 'Salad', 'Pickle']
          }
        }
      },
      Saturday: {
        breakfast: {
          time: '7:00 AM - 9:00 AM',
          menu: {
            regular: ['Paratha', 'Aloo Curry', 'Boiled Eggs', 'Tea/Coffee', 'Bread'],
            special: ['Sprouts', 'Cornflakes']
          }
        },
        lunch: {
          time: '12:00 PM - 2:00 PM',
          menu: {
            regular: ['Rice', 'Dal', 'Rajma', 'Curd', 'Pickle', 'Papad', 'Salad', 'Chapati'],
            special: ['Sweet: Gajar Ka Halwa']
          }
        },
        dinner: {
          time: '7:00 PM - 9:00 PM',
          menu: {
            regular: ['Chapati', 'Chicken Biryani', 'Raita', 'Salad', 'Pickle']
          }
        }
      },
      Sunday: {
        breakfast: {
          time: '7:00 AM - 9:00 AM',
          menu: {
            regular: ['Chole Bhature', 'Boiled Eggs', 'Tea/Coffee', 'Bread'],
            special: ['Fruit Bowl', 'Cornflakes']
          }
        },
        lunch: {
          time: '12:00 PM - 2:00 PM',
          menu: {
            regular: ['Rice', 'Dal Makhani', 'Shahi Paneer', 'Curd', 'Pickle', 'Papad', 'Salad', 'Chapati'],
            special: ['Sweet: Ice Cream']
          }
        },
        dinner: {
          time: '7:00 PM - 9:00 PM',
          menu: {
            regular: ['Chapati', 'Mutton Curry', 'Rice', 'Dal Fry', 'Salad', 'Pickle']
          }
        }
      }
    }
  },
  {
    id: 'ifc-c',
    name: 'IFC-C Mess',
    image: 'https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?auto=format&fit=crop&w=800&q=80',
    description: 'Institute Food Court C - Main Campus',
    staff: [
      { role: 'Mess Manager', name: 'Mr. Ramesh Kumar', contact: '+91 9876543213' },
      { role: 'Head Chef', name: 'Mr. Vikram Singh', contact: '+91 9876543214' },
      { role: 'Quality Supervisor', name: 'Ms. Anjali Sharma', contact: '+91 9876543215' }
    ],
    menu: {
      Monday: {
        breakfast: {
          time: '7:00 AM - 9:00 AM',
          menu: {
            regular: ['Idli Sambar', 'Chutney', 'Boiled Eggs', 'Tea/Coffee', 'Bread', 'Butter', 'Jam'],
            special: ['Sprouts', 'Cornflakes']
          }
        },
        lunch: {
          time: '12:00 PM - 2:00 PM',
          menu: {
            regular: ['Rice', 'Dal', 'Mixed Veg Curry', 'Curd', 'Pickle', 'Papad', 'Salad', 'Chapati'],
            special: ['Sweet: Gulab Jamun']
          }
        },
        dinner: {
          time: '7:00 PM - 9:00 PM',
          menu: {
            regular: ['Chapati', 'Paneer Butter Masala', 'Rice', 'Dal Fry', 'Salad', 'Pickle']
          }
        }
      },
      Tuesday: {
        breakfast: {
          time: '7:00 AM - 9:00 AM',
          menu: {
            regular: ['Poha', 'Upma', 'Boiled Eggs', 'Tea/Coffee', 'Bread', 'Butter', 'Jam'],
            special: ['Fruit Bowl', 'Cornflakes']
          }
        },
        lunch: {
          time: '12:00 PM - 2:00 PM',
          menu: {
            regular: ['Rice', 'Dal Tadka', 'Aloo Gobi', 'Curd', 'Pickle', 'Papad', 'Salad', 'Chapati'],
            special: ['Sweet: Kheer']
          }
        },
        dinner: {
          time: '7:00 PM - 9:00 PM',
          menu: {
            regular: ['Chapati', 'Chicken Curry', 'Rice', 'Dal Fry', 'Salad', 'Pickle']
          }
        }
      },
      Wednesday: {
        breakfast: {
          time: '7:00 AM - 9:00 AM',
          menu: {
            regular: ['Dosa', 'Sambar', 'Chutney', 'Boiled Eggs', 'Tea/Coffee', 'Bread'],
            special: ['Oats', 'Cornflakes']
          }
        },
        lunch: {
          time: '12:00 PM - 2:00 PM',
          menu: {
            regular: ['Rice', 'Dal', 'Bhindi Masala', 'Curd', 'Pickle', 'Papad', 'Salad', 'Chapati'],
            special: ['Sweet: Jalebi']
          }
        },
        dinner: {
          time: '7:00 PM - 9:00 PM',
          menu: {
            regular: ['Chapati', 'Egg Curry', 'Rice', 'Dal Fry', 'Salad', 'Pickle']
          }
        }
      },
      Thursday: {
        breakfast: {
          time: '7:00 AM - 9:00 AM',
          menu: {
            regular: ['Puri', 'Aloo Bhaji', 'Boiled Eggs', 'Tea/Coffee', 'Bread'],
            special: ['Sprouts', 'Cornflakes']
          }
        },
        lunch: {
          time: '12:00 PM - 2:00 PM',
          menu: {
            regular: ['Rice', 'Dal', 'Cabbage Curry', 'Curd', 'Pickle', 'Papad', 'Salad', 'Chapati'],
            special: ['Sweet: Rasmalai']
          }
        },
        dinner: {
          time: '7:00 PM - 9:00 PM',
          menu: {
            regular: ['Chapati', 'Mixed Veg Curry', 'Rice', 'Dal Fry', 'Salad', 'Pickle']
          }
        }
      },
      Friday: {
        breakfast: {
          time: '7:00 AM - 9:00 AM',
          menu: {
            regular: ['Uttapam', 'Sambar', 'Chutney', 'Boiled Eggs', 'Tea/Coffee', 'Bread'],
            special: ['Fruit Bowl', 'Cornflakes']
          }
        },
        lunch: {
          time: '12:00 PM - 2:00 PM',
          menu: {
            regular: ['Rice', 'Dal', 'Paneer Curry', 'Curd', 'Pickle', 'Papad', 'Salad', 'Chapati'],
            special: ['Sweet: Rasgulla']
          }
        },
        dinner: {
          time: '7:00 PM - 9:00 PM',
          menu: {
            regular: ['Chapati', 'Fish Curry', 'Rice', 'Dal Fry', 'Salad', 'Pickle']
          }
        }
      },
      Saturday: {
        breakfast: {
          time: '7:00 AM - 9:00 AM',
          menu: {
            regular: ['Paratha', 'Aloo Curry', 'Boiled Eggs', 'Tea/Coffee', 'Bread'],
            special: ['Sprouts', 'Cornflakes']
          }
        },
        lunch: {
          time: '12:00 PM - 2:00 PM',
          menu: {
            regular: ['Rice', 'Dal', 'Rajma', 'Curd', 'Pickle', 'Papad', 'Salad', 'Chapati'],
            special: ['Sweet: Gajar Ka Halwa']
          }
        },
        dinner: {
          time: '7:00 PM - 9:00 PM',
          menu: {
            regular: ['Chapati', 'Chicken Biryani', 'Raita', 'Salad', 'Pickle']
          }
        }
      },
      Sunday: {
        breakfast: {
          time: '7:00 AM - 9:00 AM',
          menu: {
            regular: ['Chole Bhature', 'Boiled Eggs', 'Tea/Coffee', 'Bread'],
            special: ['Fruit Bowl', 'Cornflakes']
          }
        },
        lunch: {
          time: '12:00 PM - 2:00 PM',
          menu: {
            regular: ['Rice', 'Dal Makhani', 'Shahi Paneer', 'Curd', 'Pickle', 'Papad', 'Salad', 'Chapati'],
            special: ['Sweet: Ice Cream']
          }
        },
        dinner: {
          time: '7:00 PM - 9:00 PM',
          menu: {
            regular: ['Chapati', 'Mutton Curry', 'Rice', 'Dal Fry', 'Salad', 'Pickle']
          }
        }
      }
    }
  },
  {
    id: 'ifc-d',
    name: 'IFC-D Mess',
    image: 'https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?auto=format&fit=crop&w=800&q=80',
    description: 'Institute Food Court D - Main Campus',
    staff: [
      { role: 'Mess Manager', name: 'Mr. Ramesh Kumar', contact: '+91 9876543213' },
      { role: 'Head Chef', name: 'Mr. Vikram Singh', contact: '+91 9876543214' },
      { role: 'Quality Supervisor', name: 'Ms. Anjali Sharma', contact: '+91 9876543215' }
    ],
    menu: {
      Monday: {
        breakfast: {
          time: '7:00 AM - 9:00 AM',
          menu: {
            regular: ['Idli Sambar', 'Chutney', 'Boiled Eggs', 'Tea/Coffee', 'Bread', 'Butter', 'Jam'],
            special: ['Sprouts', 'Cornflakes']
          }
        },
        lunch: {
          time: '12:00 PM - 2:00 PM',
          menu: {
            regular: ['Rice', 'Dal', 'Mixed Veg Curry', 'Curd', 'Pickle', 'Papad', 'Salad', 'Chapati'],
            special: ['Sweet: Gulab Jamun']
          }
        },
        dinner: {
          time: '7:00 PM - 9:00 PM',
          menu: {
            regular: ['Chapati', 'Paneer Butter Masala', 'Rice', 'Dal Fry', 'Salad', 'Pickle']
          }
        }
      },
      Tuesday: {
        breakfast: {
          time: '7:00 AM - 9:00 AM',
          menu: {
            regular: ['Poha', 'Upma', 'Boiled Eggs', 'Tea/Coffee', 'Bread', 'Butter', 'Jam'],
            special: ['Fruit Bowl', 'Cornflakes']
          }
        },
        lunch: {
          time: '12:00 PM - 2:00 PM',
          menu: {
            regular: ['Rice', 'Dal Tadka', 'Aloo Gobi', 'Curd', 'Pickle', 'Papad', 'Salad', 'Chapati'],
            special: ['Sweet: Kheer']
          }
        },
        dinner: {
          time: '7:00 PM - 9:00 PM',
          menu: {
            regular: ['Chapati', 'Chicken Curry', 'Rice', 'Dal Fry', 'Salad', 'Pickle']
          }
        }
      },
      Wednesday: {
        breakfast: {
          time: '7:00 AM - 9:00 AM',
          menu: {
            regular: ['Dosa', 'Sambar', 'Chutney', 'Boiled Eggs', 'Tea/Coffee', 'Bread'],
            special: ['Oats', 'Cornflakes']
          }
        },
        lunch: {
          time: '12:00 PM - 2:00 PM',
          menu: {
            regular: ['Rice', 'Dal', 'Bhindi Masala', 'Curd', 'Pickle', 'Papad', 'Salad', 'Chapati'],
            special: ['Sweet: Jalebi']
          }
        },
        dinner: {
          time: '7:00 PM - 9:00 PM',
          menu: {
            regular: ['Chapati', 'Egg Curry', 'Rice', 'Dal Fry', 'Salad', 'Pickle']
          }
        }
      },
      Thursday: {
        breakfast: {
          time: '7:00 AM - 9:00 AM',
          menu: {
            regular: ['Puri', 'Aloo Bhaji', 'Boiled Eggs', 'Tea/Coffee', 'Bread'],
            special: ['Sprouts', 'Cornflakes']
          }
        },
        lunch: {
          time: '12:00 PM - 2:00 PM',
          menu: {
            regular: ['Rice', 'Dal', 'Cabbage Curry', 'Curd', 'Pickle', 'Papad', 'Salad', 'Chapati'],
            special: ['Sweet: Rasmalai']
          }
        },
        dinner: {
          time: '7:00 PM - 9:00 PM',
          menu: {
            regular: ['Chapati', 'Mixed Veg Curry', 'Rice', 'Dal Fry', 'Salad', 'Pickle']
          }
        }
      },
      Friday: {
        breakfast: {
          time: '7:00 AM - 9:00 AM',
          menu: {
            regular: ['Uttapam', 'Sambar', 'Chutney', 'Boiled Eggs', 'Tea/Coffee', 'Bread'],
            special: ['Fruit Bowl', 'Cornflakes']
          }
        },
        lunch: {
          time: '12:00 PM - 2:00 PM',
          menu: {
            regular: ['Rice', 'Dal', 'Paneer Curry', 'Curd', 'Pickle', 'Papad', 'Salad', 'Chapati'],
            special: ['Sweet: Rasgulla']
          }
        },
        dinner: {
          time: '7:00 PM - 9:00 PM',
          menu: {
            regular: ['Chapati', 'Fish Curry', 'Rice', 'Dal Fry', 'Salad', 'Pickle']
          }
        }
      },
      Saturday: {
        breakfast: {
          time: '7:00 AM - 9:00 AM',
          menu: {
            regular: ['Paratha', 'Aloo Curry', 'Boiled Eggs', 'Tea/Coffee', 'Bread'],
            special: ['Sprouts', 'Cornflakes']
          }
        },
        lunch: {
          time: '12:00 PM - 2:00 PM',
          menu: {
            regular: ['Rice', 'Dal', 'Rajma', 'Curd', 'Pickle', 'Papad', 'Salad', 'Chapati'],
            special: ['Sweet: Gajar Ka Halwa']
          }
        },
        dinner: {
          time: '7:00 PM - 9:00 PM',
          menu: {
            regular: ['Chapati', 'Chicken Biryani', 'Raita', 'Salad', 'Pickle']
          }
        }
      },
      Sunday: {
        breakfast: {
          time: '7:00 AM - 9:00 AM',
          menu: {
            regular: ['Chole Bhature', 'Boiled Eggs', 'Tea/Coffee', 'Bread'],
            special: ['Fruit Bowl', 'Cornflakes']
          }
        },
        lunch: {
          time: '12:00 PM - 2:00 PM',
          menu: {
            regular: ['Rice', 'Dal Makhani', 'Shahi Paneer', 'Curd', 'Pickle', 'Papad', 'Salad', 'Chapati'],
            special: ['Sweet: Ice Cream']
          }
        },
        dinner: {
          time: '7:00 PM - 9:00 PM',
          menu: {
            regular: ['Chapati', 'Mutton Curry', 'Rice', 'Dal Fry', 'Salad', 'Pickle']
          }
        }
      }
    }
  }
];

export default function MessMenu() {
  const [selectedMess, setSelectedMess] = useState<Mess>(MESSES[0]);
  const [selectedDay, setSelectedDay] = useState<string>(() => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[new Date().getDay()];
  });

  const handleContactStaff = (contact: string) => {
    toast.success(`Contacting staff member at ${contact}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-4 gap-8">
        {/* Mess Selection Sidebar */}
        <div className="md:col-span-1 space-y-4">
          <h2 className="text-xl font-bold mb-4 text-red-500">Select Mess</h2>
          {MESSES.map((mess) => (
            <button
              key={mess.id}
              onClick={() => setSelectedMess(mess)}
              className={`w-full text-left p-4 rounded-lg transition-all ${
                selectedMess.id === mess.id
                  ? 'bg-red-900/20 border border-red-500'
                  : 'bg-gray-800 hover:bg-gray-700'
              }`}
            >
              <div className="aspect-video mb-3 rounded-lg overflow-hidden">
                <img
                  src={mess.image}
                  alt={mess.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-semibold text-lg text-red-400">{mess.name}</h3>
              <p className="text-sm text-gray-400">{mess.description}</p>
            </button>
          ))}
        </div>

        {/* Menu Display */}
        <div className="md:col-span-3">
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <h1 className="text-2xl font-bold text-red-500 mb-4 md:mb-0">
                {selectedMess.name} Menu
              </h1>
              <div className="flex gap-2">
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(
                  (day) => (
                    <button
                      key={day}
                      onClick={() => setSelectedDay(day)}
                      className={`px-3 py-1 rounded-full text-sm ${
                        selectedDay === day
                          ? 'bg-red-500 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      {day.slice(0, 3)}
                    </button>
                  )
                )}
              </div>
            </div>

            <div className="space-y-6">
              {/* Breakfast */}
              <div className="bg-gray-900 rounded-lg p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="text-red-400" />
                  <h2 className="text-xl font-semibold">Breakfast</h2>
                  <span className="text-sm text-gray-400">
                    ({selectedMess.menu[selectedDay].breakfast.time})
                  </span>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-400 mb-2">Regular Items</h3>
                    <ul className="list-disc list-inside space-y-1">
                      {selectedMess.menu[selectedDay].breakfast.menu.regular.map((item, index) => (
                        <li key={index} className="text-gray-300">{item}</li>
                      ))}
                    </ul>
                  </div>
                  {selectedMess.menu[selectedDay].breakfast.menu.special && (
                    <div>
                      <h3 className="text-sm font-medium text-red-400 mb-2">Special Items</h3>
                      <ul className="list-disc list-inside space-y-1">
                        {selectedMess.menu[selectedDay].breakfast.menu.special.map((item, index) => (
                          <li key={index} className="text-gray-300">{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              {/* Lunch */}
              <div className="bg-gray-900 rounded-lg p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Utensils className="text-red-400" />
                  <h2 className="text-xl font-semibold">Lunch</h2>
                  <span className="text-sm text-gray-400">
                    ({selectedMess.menu[selectedDay].lunch.time})
                  </span>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-400 mb-2">Regular Items</h3>
                    <ul className="list-disc list-inside space-y-1">
                      {selectedMess.menu[selectedDay].lunch.menu.regular.map((item, index) => (
                        <li key={index} className="text-gray-300">{item}</li>
                      ))}
                    </ul>
                  </div>
                  {selectedMess.menu[selectedDay].lunch.menu.special && (
                    <div>
                      <h3 className="text-sm font-medium text-red-400 mb-2">Special Items</h3>
                      <ul className="list-disc list-inside space-y-1">
                        {selectedMess.menu[selectedDay].lunch.menu.special.map((item, index) => (
                          <li key={index} className="text-gray-300">{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              {/* Dinner */}
              <div className="bg-gray-900 rounded-lg p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Utensils className="text-red-400" />
                  <h2 className="text-xl font-semibold">Dinner</h2>
                  <span className="text-sm text-gray-400">
                    ({selectedMess.menu[selectedDay].dinner.time})
                  </span>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-400 mb-2">Regular Items</h3>
                    <ul className="list-disc list-inside space-y-1">
                      {selectedMess.menu[selectedDay].dinner.menu.regular.map((item, index) => (
                        <li key={index} className="text-gray-300">{item}</li>
                      ))}
                    </ul>
                  </div>
                  {selectedMess.menu[selectedDay].dinner.menu.special && (
                    <div>
                      <h3 className="text-sm font-medium text-red-400 mb-2">Special Items</h3>
                      <ul className="list-disc list-inside space-y-1">
                        {selectedMess.menu[selectedDay].dinner.menu.special.map((item, index) => (
                          <li key={index} className="text-gray-300">{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Staff Contact */}
            <div className="mt-8">
              <h2 className="text-xl font-bold text-red-500 mb-4">Mess Staff</h2>
              <div className="grid md:grid-cols-3 gap-4">
                {selectedMess.staff.map((staff, index) => (
                  <div key={index} className="bg-gray-900 p-4 rounded-lg">
                    <h3 className="font-medium text-gray-300">{staff.role}</h3>
                    <p className="text-gray-400 text-sm mb-2">{staff.name}</p>
                    <button
                      onClick={() => handleContactStaff(staff.contact)}
                      className="text-red-400 text-sm hover:text-red-300 flex items-center gap-1"
                    >
                      <MessageSquare className="w-4 h-4" />
                      Contact
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}