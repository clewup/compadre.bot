interface Charity {
  title: string;
  description: string;
  image: string;
}

export const Charities: Charity[] = [
  {
    title: "Alzheimer's Society",
    description: `By 2025, 1 million people will be living with the condition in the UK, and many millions more carers, partners, families and friends are affected.
             \n\nLack of treatments and postcode lottery for care means that people with dementia and their families aren’t getting the support they need, when they need it.
             \n\nConsider donating today to help those living with dementia get the support they need at https://www.alzheimers.org.uk/get-involved/make-a-donation`,
    image:
      "https://centaur-wp.s3.eu-central-1.amazonaws.com/designweek/prod/content/uploads/2017/01/26175345/Screen-Shot-2017-01-26-at-17.49.18.png",
  },
  {
    title: "Great Ormond Street Hospital",
    description: `Every day, young lives hang in the balance as patients, families and staff battle the most complex illnesses. Every day, the brightest minds come together to achieve pioneering medical breakthroughs that change the lives of thousands of children – and change the world.
        \n\nDespite the greatest challenges a child can face, the hospital is a place where being sick does not always mean being sad. And it’s a place where you’ll find – today and every day – some of the bravest people you could ever meet.
        \n\nThis extraordinary hospital has always depended on charitable support, and every day is a chance for you to make a difference by donating at https://www.gosh.org/donate/.`,
    image:
      "https://www.civilsociety.co.uk/static/ca22247a-114b-47e6-a359ca916db88553/article_img_detail_5ba532e110cf7bcee7b0d6e49c027c8b/GOSH-logo-440png-1.png",
  },
  {
    title: "Turkey and Syria Earthquake Relief Fund",
    description: `Two powerful earthquakes struck Turkey and Syria on Feb. 6, killing more than 50,000 people and injuring thousands more. The death toll is anticipated to grow significantly. 
        \n\nMillions of survivors urgently need help. Your donation to the Turkey and Syria Earthquake Relief Fund will provide emergency relief and fuel long-term recovery efforts in Turkey and Syria.
        \n\nPlease consider donating at https://donate.redcross.org.uk/appeal/turkey-syria-earthquake-appeal`,
    image:
      "https://www.actionaid.org.uk/sites/default/files/styles/open_graph/public/2023-02/RS17592__scr.jpg?h=08b56bf5&itok=neEhXCBV",
  },
];
