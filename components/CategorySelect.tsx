import { useState, useCallback, useEffect, forwardRef } from 'react';
import {
  Dialog,
  DialogTitle,
  List,
  DialogContent,
  Checkbox,
  FormGroup,
  FormControlLabel,
  Slide,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  Box,
  Chip,
  MenuItem,
} from '@mui/material';
import { requestMsg } from '@/components/server/utils/request';
import { Category } from '@prisma/client';
import type { Data as CatData } from '@/pages/api/post/categories/list';
import useLocale, { useLocaleName } from '@/components/utils/useLocale';
import { TransitionProps } from '@mui/material/transitions';
import formLocale from '@/locale/form';

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const CategorySelect = ({
  selectedVlues,
  title,
}: {
  selectedVlues: Array<string | number>;
  title?: string;
  onResult: (values: Array<string | number>) => void;
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const lang = useLocaleName();
  const formL = useLocale(formLocale);
  const [categories, setCategories] = useState<Category[]>([]);
  const fetchCatCallBack = useCallback(() => {
    const fetchCatData = (page: number, size: number) => {
      requestMsg<CatData>('/api/post/categories/list', {
        method: 'post',
        data: { page, size, catId: 1 },
        lang,
      }).then((res) => {
        setCategories(res.categories || []);
      });
    };
    fetchCatData(1, 100);
  }, [lang]);
  useEffect(() => {
    fetchCatCallBack();
  }, [fetchCatCallBack]);
  const [selectCategories, setSelectCategories] =
    useState<Array<string | number>>(selectedVlues);
  const openSelect = () => {
    setOpen(true);
  };

  const handleChange = (action: string, value: string | number) => {
    if (action == 'add') {
      selectCategories.push(value);
      setSelectCategories(selectCategories);
    }
    if (action == 'remove') {
      setSelectCategories(selectCategories.filter((item) => item !== value));
    }
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Dialog
        sx={{ '& .MuiDialog-paper': { width: '80%', maxHeight: 435 } }}
        open={open}
        TransitionComponent={Transition}
      >
        <DialogTitle>{title}</DialogTitle>

        <DialogContent dividers>
          <FormControl sx={{ m: 1, minWidth: 120 }}>
            {categories &&
              categories.map((value) => {
                return (
                  <FormControlLabel
                    control={
                      <Checkbox
                        size={'small'}
                        value={value.id}
                        onChange={(event) => {
                          if (!event.target.checked) {
                            handleChange('remove', value.id);
                          } else {
                            handleChange('add', value.id);
                          }
                        }}
                        checked={selectCategories.includes(value.id)}
                      />
                    }
                    key={value.id}
                    label={value.cat}
                  ></FormControlLabel>
                );
              })}
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpen(false);
            }}
          >
            {formL['close']}
          </Button>
          <Button onClick={handleClose}>{formL['ok']}</Button>
        </DialogActions>
      </Dialog>
      <Button
        onClick={() => {
          openSelect();
        }}
      >
        选择
      </Button>
      {categories &&
        categories.map((value) => {
          if (selectCategories.includes(value.id)) {
            return (
              <Chip key={value.id} label={value.cat} variant="outlined"></Chip>
            );
          }
        })}
    </>
  );
};

export default CategorySelect;
