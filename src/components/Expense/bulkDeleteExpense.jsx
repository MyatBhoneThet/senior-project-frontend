import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';

export const bulkDeleteExpense = async (period) => {
  try {
    const response = await axiosInstance.delete(API_PATHS.EXPENSE.BULK_DELETE_EXPENSE(period));
    return response.data; // Return success message
  } catch (error) {
    console.error(error?.response?.data || error);
    throw new Error(error?.response?.data?.message || 'Bulk delete failed.');
  }
};
