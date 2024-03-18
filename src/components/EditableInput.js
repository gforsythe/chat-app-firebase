import { useCallback, useState } from 'react';
import { Icon, Input, InputGroup, Alert } from 'rsuite';

function EditableInput({
  initalValue,
  onSave,
  label = null,
  placeholder = 'write your value',
  emptyMsg = 'input is empty',
  wrapperClassName = '',
  ...inputProps
}) {
  const [input, setInput] = useState(initalValue);
  const [isEditable, setEditable] = useState(false);

  const onInputChange = useCallback(value => {
    setInput(value);
  }, []);

  const onEditClick = useCallback(() => {
    setEditable(p => !p);
    setInput(initalValue);
  }, [initalValue]);

  const onSaveClick = async () => {
    const trimmed = input.trim();
    if (trimmed === '') {
      Alert.info(emptyMsg, 4000);
      return;
    }
    if (trimmed !== initalValue) {
      await onSave(trimmed);
    }
    setEditable(false);
  };

  return (
    <div className={wrapperClassName}>
      {label}
      <InputGroup>
        <Input
          {...inputProps}
          disabled={!isEditable}
          placeholder={placeholder}
          value={input}
          onChange={onInputChange}
        />
        <InputGroup.Button onClick={onEditClick}>
          <Icon icon={isEditable ? 'close' : 'edit2'}></Icon>
        </InputGroup.Button>
        {isEditable && (
          <InputGroup.Button onClick={onSaveClick}>
            <Icon icon={'check'}></Icon>
          </InputGroup.Button>
        )}
      </InputGroup>
    </div>
  );
}

export default EditableInput;
