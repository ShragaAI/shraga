import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { CircularProgress, TextField, MenuItem } from "@mui/material";
import Typography from '@mui/material/Typography';

type PreferencesProps = {
  preferences?: Record<string, any>;
  handlePreferenceChange: (
    preferences: { [key: string]: any; }
  ) => void;
};

export type formValidator = {
  validate: () => boolean;
};

function isEmptyValue(value: any): boolean {
  return value === null || value === undefined || value === ""
    || (Array.isArray(value) && value.length === 0)
    || (value && typeof value === 'object' && !Array.isArray(value) && Object.keys(value).length === 0
    );
}

const Preferences = forwardRef<formValidator, PreferencesProps>(({ preferences, handlePreferenceChange }, ref) => {

  const [fields, setFields] = useState<{ [key: string]: any }>({});
  const [fieldsReady, setFieldsReady] = useState(false);
  const [formErrors, setFormErrors] = useState<{ [field: string]: string }>({});
  const [hasFormErrors, setHasFormErrors] = useState(false);

  useImperativeHandle(ref, () => ({
    validate(): boolean {
      if (preferences) {
        let hasError = false;
        const newErrors: Record<string, string> = {};
        
        Object.entries(preferences).forEach(([key, value]) => {
          const isRequired = value && typeof value === 'object' && 'required' in value 
            ? value.required 
            : false;
          
          if (isRequired && isEmptyValue(fields[key])) {
            newErrors[key] = `This field is required.`;
            hasError = true;
          }
        });
        
        setFormErrors(newErrors);
        return !hasError;
      }
      return false;
    },
  }));

  const handleChange = (key: string, type?: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setFormErrors({ ...formErrors, [key]: '' });
    const newValue = e.target.value;
    if (type && type === 'integer') {
      if (/^(0|[1-9]\d*)$/.test(newValue)) {
        setFields({ ...fields, [key]: parseInt(newValue) });
      } else if (!newValue.trim()) {
        setFields({ ...fields, [key]: '' });
      }
    } else if (type && type == 'boolean') {
      setFields({ ...fields, [key]: newValue.toLowerCase() == 'true' });
    } else {
      setFields({ ...fields, [key]: newValue });
    }
  };

  useEffect(() => {
    if (preferences) {
      let allFieldsValid = true;
      Object.entries(preferences).forEach(([key]) => {
        allFieldsValid = allFieldsValid && isEmptyValue(formErrors[key]);
      });
      setHasFormErrors(!allFieldsValid);
    }
  }, [formErrors]);

  useEffect(() => {
    if (preferences) {
      const newValues: { [key: string]: any } = {};
      Object.entries(preferences).map(([key, value]) => {
        if (value && typeof value === 'object' && 'default_value' in value) {
          if (value.type === 'integer') {
            newValues[key] = (!isEmptyValue(value.default_value) && typeof value.default_value === 'number') 
              ? value.default_value 
              : '';
          } else if (value.available_values) {
            const defaultVal = value.default_value;
            newValues[key] = value.available_values.includes(defaultVal) 
              ? defaultVal 
              : value.available_values[0];
          } else {
            newValues[key] = !isEmptyValue(value.default_value) ? value.default_value : '';
          }
        } else {
          const originalMetadata = Object.entries(preferences).find(([k, v]) => 
            k === key && v && typeof v === 'object' && 'available_values' in v
          );

          if (originalMetadata && originalMetadata[1].available_values) {
            const availableValues = originalMetadata[1].available_values;
            newValues[key] = availableValues.includes(value) 
              ? value 
              : availableValues[0];
          } else {
            newValues[key] = !isEmptyValue(value) ? value : '';
          }
        }
      });
      setFields(newValues);
      setFieldsReady(true);
    }
  }, [preferences]);

  useEffect(() => {
    handlePreferenceChange(fields);
  }, [fields]);

  return (
    <div className="flex flex-col items-center gap-4">
      {preferences && fieldsReady ? (
        Object.entries(preferences).map(([key, value]) => {
          const isMetadataFormat = value && typeof value === 'object' && 'default_value' in value;
          const available_values = isMetadataFormat ? value.available_values : undefined;
          const description = isMetadataFormat ? value.description : undefined;
          const type = isMetadataFormat ? value.type : typeof value;
  
          const label = key[0].toUpperCase() + key.slice(1).replace(/_/g, " ");
  
          if (available_values) {
            const currentValue = fields[key];
            const isValidValue = available_values.includes(currentValue);
            const valueToUse = isValidValue ? currentValue : available_values[0];

            return (
              <div className="flex flex-col gap-1 w-full" key={key}>
                <TextField
                  key={`${key}-select`}
                  value={valueToUse}
                  label={"Select " + label}
                  select
                  fullWidth
                  onChange={handleChange(key)}
                >
                  {available_values?.map((option: any) => (
                    <MenuItem key={`${key}-${option}`} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>
                {!isEmptyValue(formErrors[key]) &&
                  <Typography className="w-full" color="error" variant="body2">
                    {formErrors[key]}
                  </Typography>
                }
              </div>
            );
          } else if (type === 'boolean') {
            return (
              <div className="flex flex-col gap-1 w-full" key={key}>
                <TextField
                  key={key}
                  value={String(fields[key]) || ''}
                  label={"Select " + label}
                  select
                  fullWidth
                  onChange={handleChange(key, 'boolean')}
                >
                  <MenuItem key={'false'} value={'false'}>
                    {"false"}
                  </MenuItem>
                  <MenuItem key={'true'} value={'true'}>
                    {"true"}
                  </MenuItem>
                </TextField>
                {!isEmptyValue(formErrors[key]) &&
                  <Typography className="w-full" color="error" variant="body2">
                    {formErrors[key]}
                  </Typography>
                }
              </div>
            );
          } else if (type === 'integer' || type === 'number') {
            return (
              <div className="flex flex-col gap-1 w-full" key={key}>
                <TextField
                  key={key}
                  label={label}
                  value={fields[key]}
                  helperText={description}
                  fullWidth
                  onChange={handleChange(key, 'integer')}
                />
                {!isEmptyValue(formErrors[key]) &&
                  <Typography className="w-full" color="error" variant="body2">
                    {formErrors[key]}
                  </Typography>
                }
              </div>
            );
          } else {
            return (
              <div className="flex flex-col gap-1 w-full" key={key}>
                <TextField
                  key={key}
                  label={label}
                  value={fields[key]}
                  helperText={description}
                  fullWidth
                  onChange={handleChange(key)}
                />
                {!isEmptyValue(formErrors[key]) &&
                  <Typography className="w-full" color="error" variant="body2">
                    {formErrors[key]}
                  </Typography>
                }
              </div>
            );
          }
        })
      ) : (
        <CircularProgress />
      )}
      {hasFormErrors && (
        <Typography color="error" variant="body2">
          Please check the fields with error messages above and complete all required fields before proceeding.
        </Typography>
      )}
    </div>
  );
});

export default Preferences;
