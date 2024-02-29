import { Box, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import React from 'react';
import { apiCall } from '../helpers/helpers';

function TableOrders ({
  trigger,
  caloriesBurned
}) {
  const table = localStorage.getItem('mvtable');
  const customer = localStorage.getItem('mvuser');

  const [orders, setOrders] = React.useState([]);
  const [bill, setBill] = React.useState(0);
  const [caloriesGained, setCaloriesGained] = React.useState(0);

  React.useEffect(() => {
    const fetchOrderedItems = async () => {
      const body = {
        table_number: localStorage.getItem('mvtable')
      };
      const response = await apiCall('orders/get_ordered_items', 'POST', body);
      console.log(response.ordered_list);
      setOrders(response?.ordered_list ?? []);
    }

    const fetchCaloriesGained = async () => {
      const response = await apiCall('orders/get_ordered_items', 'POST', { table_number: table });
      setCaloriesGained(response?.calories_gained ?? 0);
    }

    const fetchCurrBill = async () => {
      const data = await apiCall('orders/get_bill', 'POST', { table_number: table });
      if (data.order_count) {
        console.log('Bill amount received');
        setBill(data.bill);
      }
    }

    fetchOrderedItems();
    fetchCurrBill();
    fetchCaloriesGained();
  }, [trigger]);

  return (
    <>
      <Box
        sx={{
          backgroundColor: '#ffffff',
          border: '1px solid #caccce',
          borderRadius: '10px',
          height: '60vh',
          padding: '0 10px'
        }}
      >
        <Box sx={{
          height: '60vh',
          overflow: 'auto'
        }}>
          <Typography variant='h4' sx={{
            margin: '10px 0 0 0',
            textAlign: 'center'
          }}>Table {table}</Typography>
          {orders.length === 0
            ? (
              <Typography sx={{ textAlign: 'center' }}>No items ordered</Typography>
            )
            : (
              <Table stickyHeader size='small'>
                <TableHead>
                  <TableRow>
                    <TableCell>Item</TableCell>
                    <TableCell>Energy (Cal)</TableCell>
                    <TableCell>Cost ($)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orders.map((orderedItem) => (
                    <TableRow key={orderedItem.id}>
                      <TableCell>{orderedItem.name}</TableCell>
                      <TableCell>{orderedItem.calories ? orderedItem.calories : 'N/A'}</TableCell>
                      <TableCell>
                        {orderedItem.redeemed
                          ? (
                            <>
                              0.00
                              <Typography
                                sx={{ fontSize: '12px' }}>(- {orderedItem.points_to_redeem} MV
                                points)</Typography>
                            </>
                          )
                          : (
                            orderedItem.price
                          )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
        </Box>
      </Box>
      <Box
        sx={{
          alignItems: 'center',
          backgroundColor: '#ffffff',
          border: '1px solid #caccce',
          borderRadius: '10px',
          display: 'flex',
          height: '20vh',
          margin: '10px 0 0 0',
          padding: '0 10px',
          verticalAlign: 'middle'
        }}
      >
        <Table size='small'>
          <TableBody>
            <TableRow>
              <TableCell sx={{ textAlign: 'right' }}>Total Cost</TableCell>
              <TableCell sx={{ textAlign: 'right' }}>${bill.toFixed(2)}</TableCell>
            </TableRow>
            {customer &&
              <TableRow>
                <TableCell sx={{ textAlign: 'right' }}>Calories Burned</TableCell>
                <TableCell sx={{ textAlign: 'right' }}>{caloriesBurned}</TableCell>
              </TableRow>
            }
            <TableRow>
              <TableCell sx={{
                borderBottom: !customer && 0,
                textAlign: 'right'
              }}>Calories
                Gained</TableCell>
              <TableCell
                sx={{
                  borderBottom: !customer && 0,
                  textAlign: 'right'
                }}>{caloriesGained}</TableCell>
            </TableRow>
            {customer &&
              <TableRow>
                <TableCell sx={{
                  borderBottom: 0,
                  textAlign: 'right'
                }}>Net Calories</TableCell>
                <TableCell sx={{
                  borderBottom: 0,
                  textAlign: 'right'
                }}>{-parseInt(caloriesBurned) + parseInt(caloriesGained)}</TableCell>
              </TableRow>
            }
          </TableBody>
        </Table>
      </Box>
    </>
  )
}

export default TableOrders;
