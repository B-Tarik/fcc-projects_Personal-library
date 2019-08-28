'use strict';

import { toast } from 'react-toastify';


export const notifyInfo  = text => toast.info(text);

export const notifyError = text => toast.error(text);

export const removeItemFromArr = (array, index) => {
  return [...array.slice(0, index), ...array.slice(index + 1)]
}

