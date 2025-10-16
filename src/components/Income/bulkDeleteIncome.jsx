import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';

export const bulkDeleteIncome = async (period) => {
  try {
    const response = await axiosInstance.delete(API_PATHS.INCOME.BULK_DELETE_INCOME(period));
    return response.data; // Return success message
  } catch (error) {
    console.error(error?.response?.data || error);
    throw new Error(error?.response?.data?.message || 'Bulk delete failed.');
  }
};
