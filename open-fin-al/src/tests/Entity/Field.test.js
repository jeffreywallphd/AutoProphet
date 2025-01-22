import { Field } from '../../Entity/Field';

describe('Field class', () => {
    it('should create a Field instance with provided properties', () => {
        const name = 'testField';
        const dataType = 'string';
        const value = 'initial value';

        const field = new Field(name, dataType, value);

        expect(field.name).toBe(name);
        expect(field.dataType).toBe(dataType);
        expect(field.value).toBe(value);
    });

    it('should update the value using setValue method', () => {
        const field = new Field('anotherField', 'number', 10);
        const newValue = 20;

        field.setValue(newValue);

        expect(field.value).toBe(newValue);
    });

    it('should not change the field value if the value of the original primitive value is altered', () => {
        var originalValue = "value1";
        const field = new Field('objectField', 'object', originalValue);

        originalValue = 'value2'; // Modify the original variable

        expect(field.value).not.toBe(originalValue);
    });
});