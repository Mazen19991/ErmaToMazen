import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import './MultipleSelect.css';
import { shouldReRender, tagsFiltering } from '../../actions/postAction';
import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export default function MultipleSelectCheckmarks({ array }) {
  const [checkboxLabel, setCheckboxLabel] = useState([]);
  const dispatch = useDispatch();
  const count = useRef(0);
  const { loading, error, posts } = useSelector(
    (state) => state.postOfFollowing
  );
  const handleChange = (event) => {
    const {
      target: { value },
    } = event;

    if (value.length > 0) {
      setCheckboxLabel(value);
    }
  };
  const removeFromState = (event) => {
    const {
      target: { value },
    } = event;
    const index = checkboxLabel.findIndex(
      (element) => element.name === value[value.length - 1].name
    );
    if (index > -1) {
      checkboxLabel.splice(index, 1);
      setCheckboxLabel([...checkboxLabel]);
    }
  };
  useEffect(() => {
    if (checkboxLabel.length > 0) {
      dispatch(tagsFiltering(checkboxLabel));
    }
  }, [checkboxLabel]);
  useEffect(() => {
    if (
      checkboxLabel.length === 0 &&
      !loading &&
      !error &&
      count.current > 0 &&
      posts.length > 0
    ) {
      dispatch(shouldReRender());

      count.current = 0;
    }
    if (count.current === 0 && posts.length > 0) {
      count.current++;
    }
  }, [error, loading, checkboxLabel]);

  return (
    <div>
      <FormControl variant='standard' sx={{ m: 1, width: '94%' }}>
        <InputLabel id='demo-multiple-checkbox-label'>Tag</InputLabel>
        <Select
          labelId='demo-multiple-checkbox-label'
          id='demo-multiple-checkbox'
          multiple
          value={checkboxLabel.map((item) => item)}
          onChange={(event) => {
            const element = event.target.value[event.target.value.length - 1];
            if (
              checkboxLabel.findIndex((item) => item.name === element.name) ===
              -1
            ) {
              handleChange(event);
            } else {
              removeFromState(event);
            }
          }}
          renderValue={(selected) =>
            selected.map((element) => element.name).join(',')
          }
          MenuProps={MenuProps}
          variant='standard'
        >
          {array.map(({ name, _id }) => {
            return (
              <MenuItem key={_id} value={{ name, id: _id }}>
                <Checkbox
                  checked={
                    checkboxLabel.findIndex(
                      (element) => element.name === name
                    ) > -1
                  }
                />
                <ListItemText primary={name} />
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    </div>
  );
}
