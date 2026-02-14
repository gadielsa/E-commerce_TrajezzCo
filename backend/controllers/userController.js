import User from '../models/User.js';

export const updateProfile = async (req, res) => {
  try {
    const { name, phone, address } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Usuário não encontrado' });
    }

    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (address) user.address = { ...user.address, ...address };

    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Perfil atualizado',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role
      }
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message || 'Erro ao atualizar perfil' });
  }
};

// Obter favoritos do usuário
export const getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('favorites');
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'Usuário não encontrado' });
    }

    return res.status(200).json({
      success: true,
      favorites: user.favorites
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || 'Erro ao buscar favoritos' });
  }
};

// Adicionar produto aos favoritos
export const addFavorite = async (req, res) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ success: false, message: 'ID do produto é obrigatório' });
    }

    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'Usuário não encontrado' });
    }

    // Verifica se já está nos favoritos
    if (user.favorites.includes(productId)) {
      return res.status(400).json({ success: false, message: 'Produto já está nos favoritos' });
    }

    user.favorites.push(productId);
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Produto adicionado aos favoritos',
      favorites: user.favorites
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || 'Erro ao adicionar favorito' });
  }
};

// Remover produto dos favoritos
export const removeFavorite = async (req, res) => {
  try {
    const { productId } = req.params;

    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'Usuário não encontrado' });
    }

    user.favorites = user.favorites.filter(id => id.toString() !== productId);
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Produto removido dos favoritos',
      favorites: user.favorites
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || 'Erro ao remover favorito' });
  }
};

// Sincronizar favoritos do localStorage
export const syncFavorites = async (req, res) => {
  try {
    const { favorites } = req.body;

    if (!Array.isArray(favorites)) {
      return res.status(400).json({ success: false, message: 'Favorites deve ser um array' });
    }

    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'Usuário não encontrado' });
    }

    // Combina favoritos existentes com os novos (sem duplicatas)
    const existingFavorites = user.favorites.map(id => id.toString());
    const newFavorites = favorites.filter(id => !existingFavorites.includes(id));
    
    user.favorites = [...user.favorites, ...newFavorites];
    await user.save();

    const populatedUser = await User.findById(user._id).populate('favorites');

    return res.status(200).json({
      success: true,
      message: 'Favoritos sincronizados',
      favorites: populatedUser.favorites
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || 'Erro ao sincronizar favoritos' });
  }
};
