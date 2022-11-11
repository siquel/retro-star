export const NES_ACCESSORIES = [
  { title: 'Controller', region: [] },
  { title: 'Zapper', region: [] },
  { title: 'Four score', region: [] },
  { title: 'Dust cover', region: [] },
]

export const getNesAccessories = () => NES_ACCESSORIES.map((item) => ({ ...item, type: 'ACCESSORY' }))
