import React, { useState } from 'react';
import { UserPlus, Mail, Lock, User } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

interface ParentSignUpFormProps {
  onToggleForm: () => void;
}

const ParentSignUpForm: React.FC<ParentSignUpFormProps> = ({ onToggleForm }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    try {
      setIsLoading(true);

      // Create parent account
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            role: 'parent'
          }
        }
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('No user data returned');

      // Create parent profile
      const { error: profileError } = await supabase
        .from('users')
        .insert([{
          id: authData.user.id,
          email: formData.email,
          first_name: formData.firstName,
          last_name: formData.lastName,
          role: 'parent',
          has_completed_onboarding: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }]);

      if (profileError) throw profileError;

      toast.success('Compte parent créé avec succès ! Vérifiez votre email.');
      onToggleForm();
    } catch (error: any) {
      console.error('Error during signup:', error);
      toast.error(error.message || 'Erreur lors de la création du compte');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="flex justify-center">
          <UserPlus className="h-12 w-12 text-[#ff5734]" />
        </div>
        <h2 className="mt-6 text-3xl font-extrabold text-[#151313]">Créer un compte parent</h2>
        <p className="mt-2 text-sm text-gray-600">
          Suivez les progrès de vos enfants et gérez leur cagnotte
        </p>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <label htmlFor="firstName" className="sr-only">Prénom</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  className="appearance-none rounded-xl relative block w-full pl-10 pr-3 py-2 border border-[#151313] bg-[#f7f7f5] placeholder-gray-500 text-[#151313] focus:outline-none focus:ring-[#ff5734] focus:border-[#ff5734] focus:z-10 sm:text-sm"
                  placeholder="Prénom"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                />
              </div>
            </div>
            <div className="flex-1">
              <label htmlFor="lastName" className="sr-only">Nom</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  className="appearance-none rounded-xl relative block w-full pl-10 pr-3 py-2 border border-[#151313] bg-[#f7f7f5] placeholder-gray-500 text-[#151313] focus:outline-none focus:ring-[#ff5734] focus:border-[#ff5734] focus:z-10 sm:text-sm"
                  placeholder="Nom"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="email" className="sr-only">Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="appearance-none rounded-xl relative block w-full pl-10 pr-3 py-2 border border-[#151313] bg-[#f7f7f5] placeholder-gray-500 text-[#151313] focus:outline-none focus:ring-[#ff5734] focus:border-[#ff5734] focus:z-10 sm:text-sm"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="sr-only">Mot de passe</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="password"
                name="password"
                type="password"
                required
                minLength={6}
                className="appearance-none rounded-xl relative block w-full pl-10 pr-3 py-2 border border-[#151313] bg-[#f7f7f5] placeholder-gray-500 text-[#151313] focus:outline-none focus:ring-[#ff5734] focus:border-[#ff5734] focus:z-10 sm:text-sm"
                placeholder="Mot de passe (minimum 6 caractères)"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={isLoading}
            className={`group relative w-full flex justify-center py-2 px-4 border border-[#151313] text-sm font-medium rounded-xl text-white ${
              isLoading ? 'bg-gray-400' : 'bg-[#ff5734] hover:bg-[#ff5734]/80'
            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ff5734] transition-colors duration-200`}
          >
            {isLoading ? 'Création en cours...' : 'Créer mon compte parent'}
          </button>
        </div>
      </form>

      <div className="text-center">
        <button
          onClick={onToggleForm}
          className="text-sm text-[#ff5734] hover:text-[#ff5734]/80"
        >
          Espace élève
        </button>
      </div>
    </div>
  );
};

export default ParentSignUpForm;