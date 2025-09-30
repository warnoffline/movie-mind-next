'use client';

import { motion } from 'framer-motion';
import { observer } from 'mobx-react-lite';

import { Button } from '@/components/Button';
import { GithubIcon } from '@/components/icons/GithubIcon';
import { GoogleIcon } from '@/components/icons/GoogleIcon';
import { Text } from '@/components/Text';
import { useUserStore } from '@/store/useRootStore';

import s from './AuthPage.module.scss';
import { AuthForm } from './components/AuthForm';
import { containerVariants, itemVariants } from './config';

const AuthPage = observer(() => {
  const { loginWithGithub, loginWithGoogle } = useUserStore();

  return (
    <motion.div
      className={s.auth_page}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div className={s.auth_page__content} variants={containerVariants}>
        <motion.div variants={itemVariants}>
          <Text view="title" color="primary">
            Вход
          </Text>
        </motion.div>

        <motion.div variants={itemVariants}>
          <AuthForm />
        </motion.div>

        <motion.div className={s.auth_page__footer} variants={itemVariants}>
          <Text color="secondary" view="p-20">
            Или с помощью
          </Text>
          <div className={s.auth_page__buttons}>
            <motion.div variants={itemVariants}>
              <Button onClick={loginWithGoogle}>
                <GoogleIcon width={32} height={32} />
              </Button>
            </motion.div>
            <motion.div variants={itemVariants}>
              <Button onClick={loginWithGithub}>
                <GithubIcon width={32} height={32} />
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
});

export default AuthPage;
