import userRepository from '../repositories/userRepository.js';

/**
 * User Store Service Interface
 * Proxies calls directly to the Supabase-enabled userRepository
 */
export const userStore = userRepository;
export default userRepository;
