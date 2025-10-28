import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';

export const bulkDeleteExpense = async (period) => {
  try {
    if (!period) throw new Error('Period is required');

    const response = await axiosInstance.delete(
      API_PATHS.EXPENSE.BULK_DELETE_EXPENSE(period)
    );

    return response.data;
  } catch (error) {
    console.error('bulkDeleteExpense error:', error?.response?.data || error);
    throw new Error(error?.response?.data?.message || 'Bulk delete failed.');
  }
};
