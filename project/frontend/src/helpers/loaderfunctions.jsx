import { redirect } from 'react-router-dom';
import { apiCall } from './helpers';

async function createGuest () {
  /* do api call here to create a guest and then set token */
}

export const tabselLoad = async () => {
  console.log('it ran');
  if (!localStorage.getItem('mvuser')) {
    await createGuest();
  }

  /* do api call to get list of tables and return them */
  const data = await apiCall('orders/get_tables', 'GET', {});
  const response = [];
  for (const table in data.table_list) {
    const body = {
      table_id: data.table_list[table].table_id,
      table_number: data.table_list[table].table_number,
      is_occupied: false
    }

    if (data.occupied_list.includes(data.table_list[table].table_number)) {
      body.is_occupied = true
    }
    response.push(body)
  }
  return response;
}

export const getProfile = async () => {
  const response = await apiCall('auth/customer/' + localStorage.getItem('mvuser'), 'GET', {});
  if (response.status === 200) {
    console.log(response.customer_info);
    return response.customer_info;
  } else {
    return [];
  }
}

export function redirectIfLoggedIn () {
  console.log('it ran');
  if (localStorage.getItem('mvtoken')) {
    console.log(localStorage.getItem('mvtoken'));
    return redirect('/tableselect');
  }
  return null;
}

export async function changeDetails (request) {
  const data = Object.fromEntries(await request.formData());
  const validEmailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  if (!data.email || !data.name || !validEmailRegex.test(data.email)) {
    return 'Invalid email';
  }
  if (!data.password) {
    return 'Password must not be empty';
  } else if (!/[0-9]/.test(data.password) || !/\w/.test(data.password) || !/\W/.test(data.password)) {
    return 'New password needs at least one letter, number and special character';
  }
  /* replace with fetch and post data */
  const body = {
    customer_id: localStorage.getItem('mvuser'),
    new_email: data.email,
    new_full_name: data.name,
    new_password: data.password
  }
  const response = await apiCall('auth/update', 'PUT', body);
  if (response.status === 400) {
    return 'Email already exists'
  }
  return 'Success!';
}

export const getCategories = async () => {
  const response = await apiCall('menu/categories', 'GET', {});
  console.log(response.categories)
  if (response.status === 200) {
    return response.categories;
  } else {
    return [];
  }
}

export async function getItems (params) {
  console.log(params.categoryid);
  const response = await apiCall('menu/items/' + params.categoryid, 'GET', {});
  if (response.status === 200) {
    return response.items;
  } else {
    return [];
  }
}

export async function getItem (params) {
  console.log(params.itemid);
  const response = await apiCall('menu/item/details/' + params.itemid, 'GET', {});
  if (response.status === 200) {
    return response.item;
  } else {
    return null;
  }
}
