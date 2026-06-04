// Fallback дані якщо API недоступний
export const MOCK_PRODUCTS = [
  {
    id: 1,
    title: "Дивана «Velvet Noir»",
    price: 24900,
    category: "дивани",
    description: "Оксамитовий диван у скандинавському стилі. М'які лінії, стійкий каркас із масиву дуба, знімні чохли. Ідеально для великої вітальні.",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80",
    rating: { rate: 4.8, count: 134 }
  },
  {
    id: 2,
    title: "Крісло «Aura»",
    price: 8750,
    category: "крісла",
    description: "Ергономічне крісло з натуральної шкіри. Поворотна основа, регульована висота, підлокітники з горіхового дерева.",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&q=80",
    rating: { rate: 4.6, count: 89 }
  },
  {
    id: 3,
    title: "Стіл «Nordic Oak»",
    price: 12400,
    category: "столи",
    description: "Обідній стіл із суцільного дубового масиву. Лаконічні металеві ніжки, матова поверхня з восковим покриттям.",
    image: "https://images.unsplash.com/photo-1530018607912-eff2daa1bac4?w=600&q=80",
    rating: { rate: 4.9, count: 57 }
  },
  {
    id: 4,
    title: "Ліжко «Halo»",
    price: 18200,
    category: "спальня",
    description: "Двоспальне ліжко з підіймальним механізмом. М'яке узголів'я у тканині букле, основа із шпонованого МДФ.",
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600&q=80",
    rating: { rate: 4.7, count: 102 }
  },
  {
    id: 5,
    title: "Шафа «Monolith»",
    price: 21500,
    category: "шафи",
    description: "Вбудована шафа-купе з дзеркальними дверима. Внутрішнє наповнення на замовлення, підсвітка у сенсорному режимі.",
    image: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=600&q=80",
    rating: { rate: 4.5, count: 43 }
  },
  {
    id: 6,
    title: "Полиця «Riff»",
    price: 4300,
    category: "стелажі",
    description: "Настінний стелаж із металевим каркасом та полицями з берести. Модульна система — можна розширювати.",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
    rating: { rate: 4.4, count: 76 }
  },
  {
    id: 7,
    title: "Диван «Lunar»",
    price: 31000,
    category: "дивани",
    description: "Кутовий диван модульної конструкції. Тканина з антикатишевим покриттям, незалежний пружинний блок.",
    image: "https://images.unsplash.com/photo-1567016432779-094069958ea5?w=600&q=80",
    rating: { rate: 4.9, count: 211 }
  },
  {
    id: 8,
    title: "Журнальний стіл «Arc»",
    price: 5900,
    category: "столи",
    description: "Скляна стільниця на арочній металевій підставці. Золотисте матове покриття основи, загартоване скло 10 мм.",
    image: "https://images.unsplash.com/photo-1499933374294-4584851538ad?w=600&q=80",
    rating: { rate: 4.3, count: 38 }
  },
  {
    id: 9,
    title: "Крісло «Cocoon»",
    price: 11200,
    category: "крісла",
    description: "Підвісне крісло-гніздо з ротанговим плетінням. Масивна сталева рамка, подушка з водовідштовхувальним покриттям.",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80",
    rating: { rate: 4.7, count: 65 }
  },
  {
    id: 10,
    title: "Комод «Drift»",
    price: 9800,
    category: "шафи",
    description: "Комод із 6 ящиками на м'яких доводчиках. Корпус із шпонованого ясеня, ручки приховані.",
    image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600&q=80",
    rating: { rate: 4.6, count: 91 }
  },
  {
    id: 11,
    title: "Ліжко «Ember»",
    price: 14700,
    category: "спальня",
    description: "Односпальне ліжко в індустріальному стилі. Каркас із трубчастої сталі, рейкова основа без пружин.",
    image: "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=600&q=80",
    rating: { rate: 4.4, count: 47 }
  },
  {
    id: 12,
    title: "Стіл «Pivot»",
    price: 7200,
    category: "столи",
    description: "Письмовий стіл із розсувною стільницею. Вбудований кабель-менеджмент, бічна тумба на колесах.",
    image: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=600&q=80",
    rating: { rate: 4.5, count: 83 }
  },
];

export const CATEGORIES = ["всі", "дивани", "крісла", "столи", "спальня", "шафи", "стелажі"];
