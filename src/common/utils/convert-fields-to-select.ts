// fieldsの値をselectに使用できる形に変換
export const convertFieldsToSelect = (fields: string): any => {
  if (fields) {
    return fields.split(',').map((field) => field.trim());
  }
};
