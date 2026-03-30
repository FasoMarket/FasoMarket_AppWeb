import { useState, useCallback } from 'react';

const validators = {
  email: (value) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(value) ? null : 'Email invalide';
  },
  phone: (value) => {
    // Format Burkina Faso: +226 XX XX XX XX ou 226XXXXXXXX
    const regex = /^(\+226|226)?[0-9]{8}$/;
    return regex.test(value.replace(/\s/g, '')) ? null : 'Numéro invalide (+226 XX XX XX XX)';
  },
  password: (value) => {
    if (value.length < 8) return 'Minimum 8 caractères';
    if (!/[A-Z]/.test(value)) return 'Au moins une majuscule';
    if (!/[0-9]/.test(value)) return 'Au moins un chiffre';
    return null;
  },
  required: (value) => {
    return value?.trim() ? null : 'Champ requis';
  },
  minLength: (min) => (value) => {
    return value?.length >= min ? null : `Minimum ${min} caractères`;
  },
  maxLength: (max) => (value) => {
    return value?.length <= max ? null : `Maximum ${max} caractères`;
  },
};

export function useFormValidation(initialValues, onSubmit) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = useCallback((fieldName, value, rules) => {
    if (!rules) return null;
    
    for (const rule of rules) {
      const error = typeof rule === 'function' ? rule(value) : validators[rule]?.(value);
      if (error) return error;
    }
    return null;
  }, []);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setValues(prev => ({ ...prev, [name]: value }));
    if (touched[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  }, [touched]);

  const handleBlur = useCallback((e, rules) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validate(name, value, rules);
    setErrors(prev => ({ ...prev, [name]: error }));
  }, [validate]);

  const handleSubmit = useCallback(async (e, validationRules) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Valider tous les champs
    const newErrors = {};
    Object.entries(validationRules).forEach(([field, rules]) => {
      const error = validate(field, values[field], rules);
      if (error) newErrors[field] = error;
    });

    setErrors(newErrors);
    setTouched(Object.keys(validationRules).reduce((acc, key) => ({ ...acc, [key]: true }), {}));

    if (Object.keys(newErrors).length === 0) {
      await onSubmit(values);
    }
    setIsSubmitting(false);
  }, [values, validate, onSubmit]);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    setValues,
    handleChange,
    handleBlur,
    handleSubmit,
  };
}
