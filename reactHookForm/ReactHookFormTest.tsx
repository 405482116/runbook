//npm install react-hook-form yup @hookform/resolvers react-select

import { render, fireEvent, screen } from '@testing-library/react';
import { Form } from './Form';
import * as yup from 'yup';

interface FormData {
  name: string;
  color: SelectOption | null;
}

describe('Form', () => {
  it('should render the form', async () => {
    const schema = yup.object().shape({
      name: yup.string().required('Name is required'),
      color: yup
        .object()
        .nullable()
        .required('Color is required'),
    });
    const defaultValues: FormData = {
      name: '',
      color: null,
    };
    const onSubmit = jest.fn();
    render(
      <Form<FormData>
        schema={schema}
        defaultValues={defaultValues}
        onSubmit={onSubmit}
      />,
    );

    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Color')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
  });

  it('should submit the form with valid data', async () => {
    const schema = yup.object().shape({
      name: yup.string().required('Name is required'),
      color: yup
        .object()
        .nullable()
        .required('Color is required'),
    });
    const defaultValues: FormData = {
      name: '',
      color: null,
    };
    const onSubmit = jest.fn();
    render(
      <Form<FormData>
        schema={schema}
        defaultValues={defaultValues}
        onSubmit={onSubmit}
      />,
    );

    const nameInput = screen.getByLabelText('Name') as HTMLInputElement;
    const colorInput = screen.getByLabelText('Color') as HTMLInputElement;
    fireEvent.change(nameInput, { target: { value: 'John' } });
    fireEvent.keyDown(colorInput, { key: 'ArrowDown' });
    fireEvent.keyDown(colorInput, { key: 'ArrowDown' });
    fireEvent.keyDown(colorInput, { key: 'Enter' });
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));
    expect(onSubmit).toHaveBeenCalledWith({ name: 'John', color: { value: 'blue', label: 'Blue' } });
  });

  it('should display validation errors', async () => {
    const schema = yup.object().shape({
      name: yup.string().required('Name is required'),
      color: yup
        .object()
        .nullable()
        .required('Color is required'),
    });
    const defaultValues: FormData = {
      name: '',
      color: null,
    };
    const onSubmit = jest.fn();
    render(
      <Form<FormData>
        schema={schema}
        defaultValues={defaultValues}
        onSubmit={onSubmit}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));
    expect(screen.getByText('Name is required')).toBeInTheDocument();
    expect(screen.getByText('Color is required')).toBeInTheDocument();
  });
});
