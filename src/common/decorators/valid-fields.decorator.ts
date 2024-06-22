import { registerDecorator, ValidationOptions } from 'class-validator';
import { getMetadataArgsStorage, ObjectType } from 'typeorm';

export function IsValidFields<T>(
  entityClass: ObjectType<T>,
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isValidFields',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (typeof value !== 'string') {
            return false;
          }
          const fields = value.split(',').map((field) => field.trim());

          // フィールド名を取得
          const entityFields = getMetadataArgsStorage()
            .filterColumns(entityClass)
            .map((column) => column.propertyName as keyof T);

          // 全てのフィールドがエンティティのフィールドに含まれているかチェック
          return fields.every((field) =>
            entityFields.includes(field as keyof T),
          );
        },
        defaultMessage() {
          // デフォルトのエラーメッセージ
          const entityFields = getMetadataArgsStorage()
            .filterColumns(entityClass)
            .map((column) => column.propertyName)
            .join(', ');
          return `fieldsの指定が正しくありません。許可されているfields: ${entityFields}`;
        },
      },
    });
  };
}
