import { useState, useCallback, useEffect, forwardRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Checkbox,
  Stack,
  FormControlLabel,
  Slide,
  DialogActions,
  Button,
  FormControl,
  Chip,
  Box,
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
  selectedValues,
  title,
  onResult,
}: {
  selectedValues:
    | Array<string>
    | Array<number>
    | (() => Promise<(number | string)[]>)
    | undefined;
  title?: string;
  onResult: (values: Array<string | number>) => void;
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const lang = useLocaleName();
  const formL = useLocale(formLocale);
  const [categories, setCategories] = useState<Category[]>([]);
  const initSelect = useCallback(() => {
    if (typeof selectedValues === 'function') {
      selectedValues().then((selectData) => {
        setSelectCategories(selectData.slice(0));
        setUiCategories(selectData.slice(0));
        alert(selectData.slice(0));
      });
    } else if (selectedValues) {
      setSelectCategories(selectedValues.slice(0));
      setUiCategories(selectedValues.slice(0));
    } else {
      setSelectCategories([]);
      setUiCategories([]);
    }
  }, [selectedValues]);
  const fetchCatCallBack = useCallback(() => {
    const fetchCatData = (page: number, size: number) => {
      requestMsg<CatData>('/api/post/categories/list', {
        method: 'post',
        data: { page, size, catId: 1 },
        lang,
      }).then((res) => {
        setCategories(res.categories || []);
        initSelect();
      });
    };
    fetchCatData(1, 100);
  }, [lang, initSelect]);

  useEffect(() => {
    fetchCatCallBack();
  }, [fetchCatCallBack]);
  useEffect(() => {
    initSelect();
  }, [selectedValues, initSelect]);
  const [selectCategories, setSelectCategories] = useState<
    Array<string | number>
  >([]);
  const [uiCategories, setUiCategories] = useState<Array<string | number>>([]);

  const openSelect = () => {
    setOpen(true);
    initSelect();
  };

  const handleChange = (action: string, value: string | number) => {
    if (action == 'add') {
      selectCategories.push(value);
      setSelectCategories(selectCategories.slice(0));
    }
    if (action == 'remove') {
      setSelectCategories(selectCategories.filter((item) => item !== value));
    }
  };
  const handleOk = () => {
    setOpen(false);
    onResult(selectCategories);
    setUiCategories(selectCategories.slice(0));
  };

  return (
    <>
      <Box sx={{ m: 1, verticalAlign: 'center' }}>
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
            <Button onClick={handleOk}>{formL['ok']}</Button>
          </DialogActions>
        </Dialog>

        <Stack direction="row" spacing={1}>
          <Button
            onClick={() => {
              openSelect();
            }}
          >
            选择
          </Button>
          {categories &&
            categories.map((value) => {
              if (uiCategories.includes(value.id)) {
                return (
                  <Chip
                    key={value.id}
                    label={value.cat}
                    variant="outlined"
                    sx={{ display: 'inline' }}
                    component={'span'}
                    size="small"
                  ></Chip>
                );
              }
            })}
        </Stack>
      </Box>
    </>
  );
};

export default CategorySelect;
