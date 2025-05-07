export const inventorySchema = {
  title: 'Inventory Schema',
  version: 0,
  primaryKey: 'id',
  type: 'object',
  properties: {
    id: {
      type: 'string',
      maxLength: 100
    },
    name: {
      type: 'string',
      maxLength: 100
    },
    quantity: {
      type: 'number',
      minimum: 0
    },
    unit: {
      type: 'string',
      maxLength: 50
    },
    date: {
      type: 'string',
      maxLength: 50
    },
    createdAt: {
      type: 'number'
    }
  },
  required: ['id', 'name', 'quantity', 'unit', 'date', 'createdAt']
}; 