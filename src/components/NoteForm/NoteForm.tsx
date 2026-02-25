import css from './NoteForm.module.css';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import type { FormikHelpers } from 'formik';
import type { NewNote } from '../../services/noteService';
import * as Yup from 'yup';
import { createNote } from '../../services/noteService';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const initialValues: NewNote = {
  title: '',
  content: '',
  tag: 'Todo',
};
interface NoteFormProps {
  onCancel: () => void;
}
const NoteFormSchema = Yup.object().shape({
  title: Yup.string()
    .min(3, 'Name too short')
    .max(50, 'Name too long')
    .required('Title is required'),
  content: Yup.string().max(500, 'Message too long'),
  tag: Yup.string()
    .oneOf(['Todo', 'Work', 'Personal', 'Meeting', 'Shopping'], 'Invalid tag')
    .required('Select tag'),
});

export default function NoteForm({ onCancel }: NoteFormProps) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      onCancel();
    },
  });
  const handleSubmit = (values: NewNote, actions: FormikHelpers<NewNote>) => {
    mutation.mutate(values);
    actions.resetForm();
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={NoteFormSchema}
      onSubmit={handleSubmit}
    >
      <Form className={css.form}>
        <div className={css.formGroup}>
          <label htmlFor="title">Title</label>
          <Field type="text" name="title" id="title" className={css.input} />
          <ErrorMessage name="title" component="span" className={css.error} />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="content">Content</label>
          <Field
            as="textarea"
            name="content"
            id="content"
            rows={8}
            className={css.textarea}
          />
          <ErrorMessage name="content" component="span" className={css.error} />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="tag">Tag</label>
          <Field as="select" id="tag" name="tag" className={css.select}>
            <option value="Todo">Todo</option>
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Meeting">Meeting</option>
            <option value="Shopping">Shopping</option>
          </Field>
          <ErrorMessage name="tag" component="span" className={css.error} />
        </div>

        <div className={css.actions}>
          <button type="button" className={css.cancelButton} onClick={onCancel}>
            Cancel
          </button>
          <button
            type="submit"
            className={css.submitButton}
            disabled={mutation.isPending}
          >
            Create note
          </button>
        </div>
      </Form>
    </Formik>
  );
}
