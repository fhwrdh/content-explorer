import React, { useState, useEffect } from 'react';
import * as R from 'ramda';
import styled from 'styled-components/macro';
import { Column, Table, AutoSizer } from 'react-virtualized';
import 'react-virtualized/styles.css'; // only needs to be imported once
import './App.css';

const Title = styled.div`
  margin: 0.5em;
  padding: 0.5em;
  display: flex;
  align-items: baseline;
  justify-content: space-between;
`;
const H1 = styled.span`
  font-size: 1.5em;
  font-variant: all-small-caps;
  margin-right: 0.5em;
`;
const TitleLeft = styled.div``;
const TitleRight = styled.div``;

const FilterInput = styled.input`
  ${({ error }) =>
    error &&
    `
    border-color: red;
    outline-color: red;
`};
  margin: 0 8px;
  padding: 8px;
  min-width: 350px;
  font-size: 1em;
`;
const ErrorMessage = styled.span`
  color: red;
`;
const FilterError = ({ error }) =>
  error && <ErrorMessage>{error.message}</ErrorMessage>;

const Container = styled.div`
  position: absolute;
  left: 1em;
  right: 1em;
  top: 4em;
  bottom: 5px;
  padding: 1em;
`;

const App = () => {
  const [filterState, setFilterState] = useState({
    value: '',
    error: null,
  });
  const [state, setState] = useState({
    loading: false,
    translations: [],
  });

  useEffect(() => {
    setState({ loading: true });
    fetch('/translations')
      .then(res => res.json())
      .then(t => {
        setState({
          langs: t.languages,
          // R.sort((a, b) => a.localeCompare(b)),
          translations: t.translations,
          loading: false,
        });
      })
      .catch(err => console.log('ERROR', err));
  }, []);

  let re = null;
  try {
    re = new RegExp(filterState.value);
  } catch (error) {
    setFilterState({
      error,
    });
  }

  const filtered = re
    ? R.filter(row => {
        return (
          re.test(row.key) ||
          re.test(row.en) ||
          re.test(row.de) ||
          re.test(row.zh) ||
          re.test(row.es)
        );
      })(state.translations || [])
    : state.transitions || [];

  return (
    <>
      <Title>
        <TitleLeft>
          <H1>Content Explorer</H1>
          {state.loading && ' Loading... '}
          <FilterInput
            error={filterState.error}
            placeholder="regex filter"
            type="text"
            value={filterState.value}
            onChange={e =>
              setFilterState({ value: e.target.value, error: null })
            }
          />
          <FilterError error={filterState.error} />
        </TitleLeft>
        <TitleRight>
          {state.translations && (
            <span>
              {filtered.length}
              {' / '}
              {state.translations.length} translations
            </span>
          )}
        </TitleRight>
      </Title>
      <Container>
        {state.translations && (
          <AutoSizer>
            {({ width, height }) => {
              const cols = 5;
              return (
                <Table
                  height={height}
                  width={width}
                  headerHeight={30}
                  rowHeight={36}
                  rowCount={filtered.length || 0}
                  rowClassName="translations-row"
                  rowGetter={({ index }) => filtered[index]}
                >
                  <Column label="Key" dataKey="key" width={width / cols} />
                  <Column label="en" dataKey="en" width={width / cols} />
                  <Column label="de" dataKey="de" width={width / cols} />
                  <Column label="zh" dataKey="zh" width={width / cols} />
                  <Column label="es" dataKey="es" width={width / cols} />
                </Table>
              );
            }}
          </AutoSizer>
        )}
      </Container>
    </>
  );
};

export default App;
