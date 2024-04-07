import React from 'react';
import Login from '../../src/screens/login';

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: jest.fn() }),
}));
jest.mock('../../src/services/Login', () => ({
  login: jest.fn(),
  getDriverInfo: jest.fn(),
  getCountryList: jest.fn(),
}));
jest.mock('../../src/utils/Location', () => ({
  checkLocationPermission: jest.fn(),
}));
jest.mock('moment', () => () => ({ format: () => '2023-11-09' }));

describe('Login component', () => {
  it('submits the form', async () => {
    const mockNavigation = { navigate: jest.fn() };
    const mockDispatch = jest.fn();
    const mockLogin = jest.fn(() => Promise.resolve({ status: true, data: {} }));
    const mockGetDriverInfo = jest.fn(() => Promise.resolve({ status: true, data: {} }));
    const mockGetCountryList = jest.fn(() => Promise.resolve({ status: true, data: [] }));
    const mockCheckLocationPermission = jest.fn(() => Promise.resolve({}));

    jest.spyOn(React, 'useDispatch').mockReturnValue(mockDispatch);
    jest.spyOn(React, 'useNavigation').mockReturnValue(mockNavigation);
    jest.spyOn(LoginModule, 'login').mockImplementation(mockLogin);
    jest.spyOn(LoginModule, 'getDriverInfo').mockImplementation(mockGetDriverInfo);
    jest.spyOn(LoginModule, 'getCountryList').mockImplementation(mockGetCountryList);
    jest.spyOn(LocationModule, 'checkLocationPermission').mockImplementation(mockCheckLocationPermission);

    const component = new Login();

    component.setState({ phoneNumber: '322562518', password: '123456' });

    await component.onSubmit();

    expect(mockLogin).toHaveBeenCalledWith({ phoneNumber: '322562518', password: '123456' });
    expect(mockGetDriverInfo).toHaveBeenCalled();
    expect(mockNavigation.navigate).toHaveBeenCalledWith('BottomTabNavigation');
  });
});
