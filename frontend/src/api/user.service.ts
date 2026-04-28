import axiosInstance from './axiosInstance';
import type { UpdateUserDto, UserProfile } from '../types/user.types';

export const getMyProfile = async (): Promise<UserProfile> => {
  const { data } = await axiosInstance.get<UserProfile>('/users/me');
  return data;
};

export const updateProfile = async (profileData: UpdateUserDto): Promise<UserProfile> => {
  const { data } = await axiosInstance.put<UserProfile>('/users/me', profileData);
  return data;
};

export const getUserProfileById = async (id: number): Promise<UserProfile> => {
  const { data } = await axiosInstance.get<UserProfile>(`/users/${id}`);
  return data;
};