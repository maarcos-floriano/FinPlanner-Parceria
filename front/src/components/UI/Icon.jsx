import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const Icon = ({ name, ...props }) => {
  // Mapear nomes simplificados para ícones
  const iconMap = {
    // Layout
    'home': 'home',
    'cog': 'cog',
    'sign-out-alt': 'sign-out-alt',
    'bars': 'bars',
    'times': 'times',
    'sun': 'sun',
    'moon': 'moon',
    'search': 'search',
    
    // Features
    'chart-line': 'chart-line',
    'wallet': 'wallet',
    'chart-pie': 'chart-pie',
    'bullseye': 'bullseye',
    'check-circle': 'check-circle',
    'crown': 'crown',
    'plus': 'plus',
    'chart-bar': 'chart-bar',
    'save': 'save',
    'edit': 'edit',
    'trash-alt': 'trash-alt',
    'exchange-alt': 'exchange-alt',
    'exclamation-triangle': 'exclamation-triangle',
    'check': 'check',
    'times-circle': 'times',
    'arrow-down': 'arrow-down',
    'arrow-up': 'arrow-up',
    'lock': 'lock',
    'download': 'download',
    'bell': 'bell',
    'chart-line-alt': 'chart-line',
    'file-export': 'file-export',
    'user': 'user',
    'envelope': 'envelope',
    'play-circle': 'play-circle',
    'user-plus': 'user-plus',
    
    // Brands
    'google': ['fab', 'google'],
    'facebook': ['fab', 'facebook']
  }

  const iconName = iconMap[name] || name
  const iconProps = Array.isArray(iconName) 
    ? { icon: iconName }
    : { icon: ['fas', iconName] }

  return <FontAwesomeIcon {...iconProps} {...props} />
}

export default Icon