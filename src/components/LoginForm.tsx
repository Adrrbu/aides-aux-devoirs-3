import React, { useState } from 'react';
import { BookOpen, Mail, Lock } from 'lucide-react';
import toast from 'react-hot-toast';

interface LoginFormProps {
  onToggleForm: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onToggleForm }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // En développement, on simule une connexion réussie
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Connexion réussie !');
      window.location.reload();
    } catch (error) {
      console.error('Error during login:', error);
      toast.error('Erreur lors de la connexion');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="flex justify-center">
          <BookOpen className="h-12 w-12 text-[#ff5734]" />
        </div>
        <h2 className="mt-6 text-3xl font-extrabold text-[#151313]">Aizily</h2>
        <p className="mt-2 text-sm text-gray-600">
          Le soutien scolaire intelligent pour votre enfant
        </p>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-4">
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
                className="appearance-none rounded-xl relative block w-full pl-10 pr-3 py-2 border border-[#151313] bg-[#f7f7f5] placeholder-gray-500 text-[#151313] focus:outline-none focus:ring-[#ff5734] focus:border-[#ff5734] focus:z-10 sm:text-sm"
                placeholder="Mot de passe"
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
            {isLoading ? 'Connexion...' : 'Se connecter'}
          </button>
        </div>
      </form>

      <div className="text-center">
        <button
          onClick={onToggleForm}
          className="text-sm text-[#ff5734] hover:text-[#ff5734]/80"
        >
          Pas encore de compte ? S'inscrire
        </button>
      </div>
    </div>
  );
};

export default LoginForm;