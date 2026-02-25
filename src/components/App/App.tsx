import css from './App.module.css';

import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import Modal from '../Modal/Modal';
import SearchBox from '../SearchBox/SearchBox';
import Pagination from '../Pagination/Pagination';
import NoteForm from '../NoteForm/NoteForm';
import NoteList from '../NoteList/NoteList';

import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { fetchNotes } from '../../services/noteService.ts';
import { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useDebouncedCallback } from 'use-debounce';

export default function App() {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [isModOpen, setIsModOpen] = useState(false);
  const { data, isLoading, isError, isSuccess } = useQuery({
    queryFn: () => fetchNotes(query, page),
    queryKey: ['notes', query, page],
    placeholderData: keepPreviousData,
  });

  const changeQuery = useDebouncedCallback((query: string) => {
    setQuery(query);
    setPage(1);
  }, 250);

  const closeModal = () => {
    setIsModOpen(false);
  };
  const totalPages = data?.totalPages ?? 0;
  const notes = data?.notes ?? [];
  useEffect(() => {
    if (isSuccess && notes.length === 0) {
      toast.error('No notes found for your request.');
    }
  }, [isSuccess, notes]);
  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox onChange={changeQuery} />
        {isSuccess && totalPages > 1 && (
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        )}

        <button className={css.button} onClick={() => setIsModOpen(true)}>
          Create note +
        </button>
      </header>

      {isModOpen && (
        <Modal onClose={closeModal}>
          <NoteForm onCancel={closeModal} />
        </Modal>
      )}
      {notes.length > 0 && <NoteList notes={notes} />}
      {isLoading && <Loader />}
      <Toaster position="top-center" />
      {isError && <ErrorMessage />}
    </div>
  );
}
